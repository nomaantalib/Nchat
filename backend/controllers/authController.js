const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, pic, phone: phone || '' });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    if (req.body.pic) user.pic = req.body.pic;
    if (req.body.newPassword) {
      user.password = req.body.newPassword;
    }

    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, pic: updated.pic, token: req.body.token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const matchByPhones = async (req, res) => {
  try {
    const { phones } = req.body; // array of normalized phone strings
    if (!phones || !Array.isArray(phones)) {
      return res.status(400).json({ message: 'phones array required' });
    }
    // Normalize: strip spaces, dashes, brackets
    const normalized = phones.map(p => p.replace(/[\s\-().+]/g, ''));
    const users = await User.find({
      phone: { $in: normalized },
      _id: { $ne: req.user._id },
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, searchUsers, updateProfile, matchByPhones };
