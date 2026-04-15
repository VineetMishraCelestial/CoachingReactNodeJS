import classRepository from '../repositories/classRepository.js';
import teacherRepository from '../repositories/teacherRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class ClassService {
  async create(instituteId, data) {
    if (data.teacherId) {
      const teacher = await teacherRepository.findById(data.teacherId);
      if (!teacher || teacher.instituteId?.toString() !== instituteId?.toString()) {
        throw new BadRequestError('Invalid teacher');
      }
    }

    const classData = await classRepository.create({
      ...data,
      instituteId
    });

    if (data.teacherId) {
      const teacher = await teacherRepository.findById(data.teacherId);
      let classIds = teacher.classIds ? JSON.parse(teacher.classIds) : [];
      classIds.push(classData.id);
      await teacherRepository.update(data.teacherId, { classIds: JSON.stringify(classIds) });
    }

    return classData;
  }

  async getById(id) {
    const classData = await classRepository.findById(id);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }
    return classData;
  }

  async getByInstitute(instituteId) {
    return classRepository.findByInstitute(instituteId, { isActive: true });
  }

  async update(id, instituteId, data) {
    const classData = await classRepository.findById(id);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }
    if (classData.instituteId?.toString() !== instituteId?.toString()) {
      throw new NotFoundError('Class not found');
    }

    if (data.teacherId) {
      const teacher = await teacherRepository.findById(data.teacherId);
      if (!teacher || teacher.instituteId?.toString() !== instituteId?.toString()) {
        throw new BadRequestError('Invalid teacher');
      }
    }

    const oldTeacherId = classData.teacherId;
    const newTeacherId = data.teacherId;

    const updated = await classRepository.update(id, data);

    if (oldTeacherId) {
      const oldTeacher = await teacherRepository.findById(oldTeacherId);
      if (oldTeacher && oldTeacher.classIds) {
        let classIds = JSON.parse(oldTeacher.classIds);
        classIds = classIds.filter(cid => cid !== id);
        await teacherRepository.update(oldTeacherId, { classIds: JSON.stringify(classIds) });
      }
    }

    if (newTeacherId) {
      const newTeacher = await teacherRepository.findById(newTeacherId);
      let classIds = newTeacher.classIds ? JSON.parse(newTeacher.classIds) : [];
      if (!classIds.includes(id)) {
        classIds.push(id);
        await teacherRepository.update(newTeacherId, { classIds: JSON.stringify(classIds) });
      }
    }

    return updated;
  }

  async delete(id, instituteId) {
    const classData = await classRepository.findById(id);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }
    if (classData.instituteId?.toString() !== instituteId?.toString()) {
      throw new NotFoundError('Class not found');
    }

    if (classData.teacherId) {
      const teacher = await teacherRepository.findById(classData.teacherId);
      if (teacher && teacher.classIds) {
        let classIds = JSON.parse(teacher.classIds);
        classIds = classIds.filter(cid => cid !== id);
        await teacherRepository.update(classData.teacherId, { classIds: JSON.stringify(classIds) });
      }
    }

    return classRepository.update(id, { isActive: false });
  }

  async getTrash(instituteId) {
    return classRepository.findTrash(instituteId);
  }

  async restore(id, instituteId) {
    const classData = await classRepository.findById(id);
    if (!classData || classData.instituteId?.toString() !== instituteId?.toString()) {
      throw new NotFoundError('Class not found');
    }
    return classRepository.update(id, { isActive: true });
  }

  async permanentDelete(id, instituteId) {
    const classData = await classRepository.findById(id);
    if (!classData || classData.instituteId?.toString() !== instituteId?.toString()) {
      throw new NotFoundError('Class not found');
    }
    return classRepository.permanentDelete(id);
  }

  async getStats(instituteId) {
    return classRepository.getStats(instituteId);
  }
}

export default new ClassService();
