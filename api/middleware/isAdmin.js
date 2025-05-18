import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query' });
  }

  try {
    const user = await User.findOne({ id: userId });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
