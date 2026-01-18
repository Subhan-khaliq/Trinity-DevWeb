import jwt from 'jsonwebtoken';
import tokenBlacklist from '../utils/tokenBlacklist.js';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.length || roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient rights' });
    }
  };
};

export { authenticate, authorize };
export default authenticate;