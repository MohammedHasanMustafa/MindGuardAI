import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || 'mind-guard-special';

// In your authController.js (or wherever generateToken is)
export const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '30d' });
};

// In your verifySession middleware
export const verifySession = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.userId }; // This is correct
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
