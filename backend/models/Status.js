const mongoose = require('mongoose');

const statusSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, default: 'image' }, // image or video
    createdAt: { type: Date, default: Date.now, expires: 86400 }, // Automatically expires deleted from DB after 24 hours (86400 secs)
  }
);

module.exports = mongoose.model('Status', statusSchema);
