import feeRepository from '../repositories/feeRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import classRepository from '../repositories/classRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class FeeService {
  async create(studentId, data) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    return feeRepository.upsert(studentId, data.month, data.year, {
      amount: data.amount || student.class.monthlyFee,
      status: data.status || 'pending',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      paymentMode: data.paymentMode
    });
  }

  async getByStudent(studentId) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return feeRepository.findByStudent(studentId);
  }

  async getByClass(classId) {
    return feeRepository.findByClass(classId);
  }

  async getByInstitute(instituteId, filters = {}) {
    return feeRepository.findByInstitute(instituteId, filters);
  }

  async getStats(instituteId) {
    const [pendingCount, collectionStats, studentCount] = await Promise.all([
      feeRepository.getPendingCount(instituteId),
      feeRepository.getCollectionStats(instituteId),
      studentRepository.findByInstitute(instituteId, { isActive: true }, { limit: 1000 })
    ]);

    return {
      collected: collectionStats.collected,
      pending: collectionStats.pending,
      pendingCount,
      totalStudents: studentCount.total
    };
  }

  async recordPayment(id, data) {
    const fee = await feeRepository.findById(id);
    if (!fee) {
      throw new NotFoundError('Fee record not found');
    }

    return feeRepository.upsert(fee.studentId, fee.month, fee.year, {
      amount: fee.amount,
      status: 'paid',
      paidDate: new Date(),
      paymentMode: data.paymentMode || 'cash'
    });
  }

  async getClassWiseFees(instituteId) {
    const classes = await classRepository.findByInstitute(instituteId, { isActive: true });
    const fees = await feeRepository.findByInstitute(instituteId);

    return classes.map(cls => {
      const classFees = fees.filter(f => f.student?.classId === cls.id);
      const paid = classFees.filter(f => f.status === 'paid').length;
      const pending = classFees.filter(f => f.status === 'pending').length;

      return {
        classId: cls.id,
        name: cls.name,
        subject: cls.subject,
        monthlyFee: cls.monthlyFee,
        studentCount: cls._count.students,
        paidCount: paid,
        pendingCount: pending
      };
    });
  }

  async generateMonthlyFees(instituteId, month, year) {
    const students = await studentRepository.findByInstitute(instituteId, { isActive: true }, { limit: 1000 });
    const now = new Date();
    const currentMonth = month || now.toLocaleString('default', { month: 'short' });
    const currentYear = year ? parseInt(year) : now.getFullYear();

    let created = 0;
    let skipped = 0;

    for (const student of students.students) {
      if (!student.class || student.class.monthlyFee <= 0) continue;
      if (!student.joiningDate) continue;

      const joinDate = new Date(student.joiningDate);
      const joinMonth = joinDate.toLocaleString('default', { month: 'short' });
      const joinYear = joinDate.getFullYear();

      if (joinYear > currentYear || (joinYear === currentYear && joinMonth >= currentMonth)) {
        continue;
      }

      const existingFee = await feeRepository.findByStudent(student.id);
      const hasCurrentMonth = existingFee.some(f => f.month === currentMonth && f.year === currentYear);

      if (!hasCurrentMonth) {
        await feeRepository.create({
          studentId: student.id,
          month: currentMonth,
          year: currentYear,
          amount: student.class.monthlyFee,
          status: 'pending'
        });
        created++;
      } else {
        skipped++;
      }
    }

    return { month: currentMonth, year: currentYear, created, skipped };
  }

  async generateAdvanceFees(instituteId, month, year) {
    const students = await studentRepository.findByInstitute(instituteId, { isActive: true }, { limit: 1000 });
    const targetYear = parseInt(year);
    const targetMonthName = month;

    let created = 0;
    let skipped = 0;

    for (const student of students.students) {
      if (!student.class || student.class.monthlyFee <= 0) continue;
      if (!student.joiningDate) continue;

      const joinDate = new Date(student.joiningDate);
      const joinMonth = joinDate.toLocaleString('default', { month: 'short' });
      const joinYear = joinDate.getFullYear();

      if (joinYear > targetYear || (joinYear === targetYear && joinMonth >= targetMonthName)) {
        continue;
      }

      const existingFee = await feeRepository.findByStudent(student.id);
      const hasMonth = existingFee.some(f => f.month === targetMonthName && f.year === targetYear);

      if (!hasMonth) {
        await feeRepository.create({
          studentId: student.id,
          month: targetMonthName,
          year: targetYear,
          amount: student.class.monthlyFee,
          status: 'pending'
        });
        created++;
      } else {
        skipped++;
      }
    }

    return { month, year, created, skipped };
  }
}

export default new FeeService();
