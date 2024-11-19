const jwt = require('jsonwebtoken');

const secretKey = 'tuClaveSecreta';

const createToken = (userId, roles) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ userId, roles }, secretKey, { expiresIn: '1h' }, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return resolve(null);
            resolve(decoded);
        });
    });
};

module.exports = { createToken, verifyToken, secretKey };
