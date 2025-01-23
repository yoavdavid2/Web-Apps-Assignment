import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required.' });

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        req.user = user;
        next();
    });
};
