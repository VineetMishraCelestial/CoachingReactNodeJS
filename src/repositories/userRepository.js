import User from '../models/User.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class UserRepository {
  async create(data) {
    const user = new User(data);
    const saved = await user.save();
    return addId(saved.toObject());
  }

  async findByMobile(mobile) {
    return User.findOne({ mobile }).lean();
  }

  async findById(id) {
    return User.findById(id).lean();
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filters)
    ]);

    return { users: addId(users), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllInstitutes() {
    return User.find({ role: 'institute', isActive: true }).select('_id').lean();
  }
}

export default new UserRepository();
