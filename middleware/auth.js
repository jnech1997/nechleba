const jwt = require('jsonwebtoken');
 
const config = process.env;

// determine if the token passed in is still valid, and if so decode user info
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!!authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);
        if (!token) {
            return res.status(403).send('A token is required for authentication');
        }
        try {
            const decoded = jwt.verify(token, config.TOKEN_KEY);
            req.userId = decoded.user_id;
            next();
        } catch (err) {
            return res.status(401).send('Invalid token');
        }
    }
    else {
        return res.status(401).send('Invalid token');
    }
}

module.exports = verifyToken;