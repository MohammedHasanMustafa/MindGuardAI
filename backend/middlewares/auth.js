import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    // Check for the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Missing or Invalid Token.' });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Token Missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Invalid Token.' });
    }

    req.userId = decoded.id; 
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
  }
};

export default userAuth;
