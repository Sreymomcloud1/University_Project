const express = require('express');
const app = express();
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRETE = process.env.JWT_SECRETE;

// ─── Middleware: verify JWT token ───────────────────────────
function authToken(req, res, next) {
    console.log(req.headers.authorization);
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];
    if (token == null)
        return res.status(401).json("Please send token");
    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json("Invalid token");
        req.user = user;
        next();
    });
}

// ─── Middleware: check role ──────────────────────────────────
function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role)
            return res.status(403).json("Unauthorized");
        next();
    };
}
// ─── Routes ─────────────────────────────────────────────────
// IMPORTANT: Replace with YOUR actual EC2 Private IPs

const STUDENT_IP  = 'http://172.31.21.157:5000'; // EC2 #1
const TEACHER_IP  = 'http://172.31.27.244:5001'; // EC2 #2
const AUTH_IP     = 'http://localhost:5002';              // same EC2
const REG_IP      = 'http://localhost:5003';              // same EC2

app.use('/student', authToken, authRole('student'), (req, res) => {
    console.log("INSIDE API GATEWAY → STUDENT ROUTE");
    proxy.web(req, res, { target: STUDENT_IP });
});

app.use('/teacher', authToken, authRole('teacher'), (req, res) => {
    console.log("INSIDE API GATEWAY → TEACHER ROUTE");
    proxy.web(req, res, { target: TEACHER_IP });
});

app.use('/auth', (req, res) => {
    proxy.web(req, res, { target: AUTH_IP });
});

app.use('/register', (req, res) => {
    proxy.web(req, res, { target: REG_IP });
});

app.listen(4000, () => {
    console.log("API Gateway running on PORT: 4000");
});