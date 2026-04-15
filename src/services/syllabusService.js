import syllabusRepository from '../repositories/syllabusRepository.js';
import classRepository from '../repositories/classRepository.js';
import Topic from '../models/Topic.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class SyllabusService {
  async create(classId, instituteId, data) {
    const classData = await classRepository.findById(classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    return syllabusRepository.create({
      ...data,
      classId
    });
  }

  async getByClass(classId, instituteId) {
    const classData = await classRepository.findById(classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    const syllabi = await syllabusRepository.findByClass(classId);
    const stats = await syllabusRepository.getProgressStats(classId);

    return { syllabi, stats };
  }

  async update(id, instituteId, data) {
    const syllabus = await syllabusRepository.findById(id);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }

    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    return syllabusRepository.update(id, data);
  }

  async delete(id, instituteId) {
    const syllabus = await syllabusRepository.findById(id);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }

    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    return syllabusRepository.delete(id);
  }

  async createSubject(syllabusId, instituteId, data) {
    const syllabus = await syllabusRepository.findById(syllabusId);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }

    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid syllabus');
    }

    return syllabusRepository.createSubject(syllabusId, data);
  }

  async createTopic(subjectId, instituteId, data) {
    const subject = await syllabusRepository.getSubjectById(subjectId);
    if (!subject) {
      throw new NotFoundError('Subject not found');
    }

    const syllabus = await syllabusRepository.findById(subject.syllabusId);
    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid subject');
    }

    return syllabusRepository.createTopic(subjectId, data);
  }

  async updateTopic(topicId, instituteId, data) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new NotFoundError('Topic not found');
    }

    const subject = await syllabusRepository.getSubjectById(topic.subjectId);
    const syllabus = await syllabusRepository.findById(subject.syllabusId);
    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid topic');
    }

    return syllabusRepository.updateTopic(topicId, data);
  }

  async deleteTopic(topicId, instituteId) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new NotFoundError('Topic not found');
    }

    const subject = await syllabusRepository.getSubjectById(topic.subjectId);
    const syllabus = await syllabusRepository.findById(subject.syllabusId);
    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid topic');
    }

    return syllabusRepository.deleteTopic(topicId);
  }

  async getSyllabusById(syllabusId, instituteId) {
    const syllabus = await syllabusRepository.findById(syllabusId);
    if (!syllabus) {
      throw new NotFoundError('Syllabus not found');
    }

    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid syllabus');
    }

    return syllabus;
  }

  async deleteSubject(subjectId, instituteId) {
    const subject = await syllabusRepository.getSubjectById(subjectId);
    if (!subject) {
      throw new NotFoundError('Subject not found');
    }

    const syllabus = await syllabusRepository.findById(subject.syllabusId);
    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid subject');
    }

    return syllabusRepository.deleteSubject(subjectId);
  }

  async updateSubject(subjectId, instituteId, data) {
    const subject = await syllabusRepository.getSubjectById(subjectId);
    if (!subject) {
      throw new NotFoundError('Subject not found');
    }

    const syllabus = await syllabusRepository.findById(subject.syllabusId);
    const classData = await classRepository.findById(syllabus.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid subject');
    }

    return syllabusRepository.updateSubject(subjectId, data);
  }
}

export default new SyllabusService();
