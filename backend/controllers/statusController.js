const Status = require('../models/Status');

const addStatus = async (req, res) => {
  try {
    const { mediaUrl, mediaType } = req.body;
    
    if (!mediaUrl) {
      return res.status(400).json({ message: 'Media URL is required' });
    }

    const status = await Status.create({
      user: req.user._id,
      mediaUrl,
      mediaType: mediaType || 'image',
    });

    const populatedStatus = await status.populate('user', 'name pic');
    res.status(201).json(populatedStatus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find().populate('user', 'name pic').sort({ createdAt: -1 });

    // Grouping stories into user containers to mimic WhatsApp grouping
    const groupedData = statuses.reduce((acc, status) => {
      const userId = status.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: status.user,
          stories: [],
        };
      }
      acc[userId].stories.push(status);
      return acc;
    }, {});

    res.json(Object.values(groupedData));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addStatus, getStatuses };
