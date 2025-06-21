const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'agency', 'client'], default: 'client' },
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String }, // URL or file path
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);