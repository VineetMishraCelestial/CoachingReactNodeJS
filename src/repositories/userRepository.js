import User from '../models/User.js';
import { toPlainObject } from '../utils/helpers.js';

export class UserRepository {
  async create(data) {
    const user = new User(data);
    const saved = await user.save();
    return toPlainObject(saved.toObject());
  }

  async findByMobile(mobile) {
    const user = await User.findOne({ mobile }).lean();
    return toPlainObject(user);
  }

  async findById(id) {
    const user = await User.findById(id).lean();
    return toPlainObject(user);
  }

  async update(id, data) {
    const user = await User.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(user);
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters)
    ]);

    return { users: toPlainObject(users), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllInstitutes() {
    const institutes = await User.find({ role: 'institute', isActive: true }).select('_id').lean();
    return toPlainObject(institutes);
  }
}

export default new UserRepository();
