module.exports = (req, res, next) => {
    const errors = req.validationErrors || [];
    
    if (errors.length > 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors }));
    } else {
        next();
    }
};
