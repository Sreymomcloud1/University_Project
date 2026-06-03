const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// ⚠️ Replace with YOUR actual EC2 Private IPs
const STUDENT_URL      = 'http://<EC2-Student-PRIVATE-IP>:5000';
const TEACHER_URL      = 'http://<EC2-Teacher-PRIVATE-IP>:5001';
const AUTH_URL         = 'http://<EC2-3-PRIVATE-IP>:5002';
const REGISTRATION_URL = 'http://<EC2-3-PRIVATE-IP>:5003';

const JWT_SECRETE = process.env.JWT_SECRETE;

// ── MIDDLEWARE ──────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRETE);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isStudent = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ message: 'Access denied: Students only' });
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ message: 'Access denied: Teachers only' });
  next();
};

// ── PUBLIC ROUTES ───────────────────────
app.use('/reg',   createProxyMiddleware({ target: REGISTRATION_URL, changeOrigin: true }));
app.use('/login', createProxyMiddleware({ target: AUTH_URL, changeOrigin: true }));

// ── STUDENT ROUTES ──────────────────────
app.use('/submitassignment',     verifyToken, isStudent, createProxyMiddleware({ target: STUDENT_URL, changeOrigin: true }));
app.use('/viewassignment',       verifyToken, isStudent, createProxyMiddleware({ target: STUDENT_URL, changeOrigin: true }));
app.use('/studentupdateprofile', verifyToken, isStudent, createProxyMiddleware({ target: STUDENT_URL, changeOrigin: true }));

// ── TEACHER ROUTES ──────────────────────
app.use('/addassignment',    verifyToken, isTeacher, createProxyMiddleware({ target: TEACHER_URL, changeOrigin: true }));
app.use('/searchstudent',    verifyToken, isTeacher, createProxyMiddleware({ target: TEACHER_URL, changeOrigin: true }));
app.use('/removeassignment', verifyToken, isTeacher, createProxyMiddleware({ target: TEACHER_URL, changeOrigin: true }));

app.listen(5004, () => console.log('API Gateway running on port 5004'));