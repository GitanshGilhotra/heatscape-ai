// Auth Controller for HEATSCAPE AI
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'heatscape_cyberpunk_super_secret_jwt_key_2026';

// In-memory user database fallback
const mockUsers = [
  {
    id: "usr_001",
    name: "Dr. Elena Vance",
    email: "elena.vance@heatscape.ai",
    role: "Lead Climate Scientist",
    organization: "NASA Urban Microclimate Research Lab"
  }
];

const login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Find or auto-authenticate guest user
  let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    user = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0] || "Researcher",
      email: email,
      role: "Climate Intelligence Operator",
      organization: "Urban Sustainability Institute"
    };
    mockUsers.push(user);
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    success: true,
    message: "Authentication successful",
    token,
    user
  });
};

const register = (req, res) => {
  const { name, email, password, organization } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Name and email are required" });
  }

  const user = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: "Urban Planner & Analyst",
    organization: organization || "Municipal Climate Taskforce"
  };

  mockUsers.push(user);

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    success: true,
    message: "User account created successfully",
    token,
    user
  });
};

const guestLogin = (req, res) => {
  const guestUser = {
    id: `usr_guest_${Math.floor(Math.random()*10000)}`,
    name: "Guest Command Officer",
    email: "guest@heatscape.ai",
    role: "Demo Operator",
    organization: "HEATSCAPE Open Research"
  };

  const token = jwt.sign({ id: guestUser.id, email: guestUser.email, role: guestUser.role }, JWT_SECRET, { expiresIn: '12h' });

  res.json({
    success: true,
    message: "Guest session initialized",
    token,
    user: guestUser
  });
};

const getMe = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = mockUsers.find(u => u.id === decoded.id) || {
      id: decoded.id,
      name: decoded.email ? decoded.email.split('@')[0] : "Command Officer",
      email: decoded.email,
      role: decoded.role || "Operator"
    };

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  login,
  register,
  guestLogin,
  getMe
};
