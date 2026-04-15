import User from '../models/User.js';

export class UserRepository {
  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async findByMobile(mobile) {
    return User.findOne({ mobile });
  }

  async findById(id) {
    return User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filters)
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllInstitutes() {
    return User.find({ role: 'institute', isActive: true }).select('_id');
  }
}

export default new UserRepository();
