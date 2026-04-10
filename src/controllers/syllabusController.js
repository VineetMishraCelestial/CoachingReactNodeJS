import syllabusService from '../services/syllabusService.js';
import { successResponse } from '../utils/response.js';

export class SyllabusController {
  async create(req, res, next) {
    try {
      const { classId, ...data } = req.body;
      const syllabus = await syllabusService.create(classId, req.user.id, data);
      return successResponse(res, syllabus, 'Syllabus created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getByClass(req, res, next) {
    try {
      const result = await syllabusService.getByClass(req.params.classId, req.user.id);
      return successResponse(res, result, 'Syllabus retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const syllabus = await syllabusService.update(req.params.id, req.user.id, req.body);
      return successResponse(res, syllabus, 'Syllabus updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await syllabusService.delete(req.params.id, req.user.id);
      return successResponse(res, null, 'Syllabus removed');
    } catch (error) {
      next(error);
    }
  }

  async createSubject(req, res, next) {
    try {
      const subject = await syllabusService.createSubject(req.params.syllabusId, req.user.id, req.body);
      return successResponse(res, subject, 'Subject added', 201);
    } catch (error) {
      next(error);
    }
  }

  async createTopic(req, res, next) {
    try {
      const topic = await syllabusService.createTopic(req.params.subjectId, req.user.id, req.body);
      return successResponse(res, topic, 'Topic added', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTopic(req, res, next) {
    try {
      const topic = await syllabusService.updateTopic(req.params.topicId, req.user.id, req.body);
      return successResponse(res, topic, 'Topic updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteTopic(req, res, next) {
    try {
      await syllabusService.deleteTopic(req.params.topicId, req.user.id);
      return successResponse(res, null, 'Topic removed');
    } catch (error) {
      next(error);
    }
  }

  async getSyllabusById(req, res, next) {
    try {
      const syllabus = await syllabusService.getSyllabusById(req.params.id, req.user.id);
      return successResponse(res, syllabus, 'Syllabus retrieved');
    } catch (error) {
      next(error);
    }
  }

  async deleteSubject(req, res, next) {
    try {
      await syllabusService.deleteSubject(req.params.subjectId, req.user.id);
      return successResponse(res, null, 'Subject removed');
    } catch (error) {
      next(error);
    }
  }

  async updateSubject(req, res, next) {
    try {
      const subject = await syllabusService.updateSubject(req.params.subjectId, req.user.id, req.body);
      return successResponse(res, subject, 'Subject updated');
    } catch (error) {
      next(error);
    }
  }
}

export default new SyllabusController();
