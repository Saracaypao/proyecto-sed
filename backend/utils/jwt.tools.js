const jwt = require('jsonwebtoken');

const secretKey = 'tuClaveSecreta';

const createToken = (userId) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ userId }, secretKey, { expiresIn: '1h' }, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
};

const verifyToken = (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, secretKey, (err) => {
            resolve(!err);
        });
    });
};

module.exports = { createToken, verifyToken, secretKey };