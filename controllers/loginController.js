const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require('jsonwebtoken');
// import user context
const User = require('../models/user');

// register a new user
exports.signup = async function (req, res) {
    try {
        // Get user input
        const { firstName, lastName, username, password } = req.body;

        // Validate user input
        if (!(username && password && firstName && lastName)) {
            res.status(400).send('All input is required');
        }
        if (!(/^[a-zA-Z0-9]+$/.test(username))) {
            return res.status(400).send('Username can only contain letters and numbers.');
        }
        if (username.length < 3 || username.length > 20) {
            return res.status(400).send('Username must be between 3 and 20 characters long.');  
        }
        if (password.length < 8 || password.length > 20) {
            return res.status(400).send('Password must be between 8 and 20 characters long.');  
        }
        // Can validate password further here
        // if (password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0) {
        //     return res.status(400).send('Password must contain at least one uppercase letter and number.'); 
        // }

        // Validate if user exists in our database
        const oldUser = await User.findOne({ username });

        if (oldUser) {
            return res.status(409).send('User Already Exists. Please Login');
        }

        // generate salt to hash password. 10 is the rounds/cost of processing data, not the length
        // the length of the salt is hardcoded in bcrypt
        // the point of salting is to randomize the password hashes stored so that there can not be a 
        // precomputed table of common hashes to passwords that a malicious hacker could easily look through
        // if they wanted to hack it, they'd have to computationally iterate with the hash algorithm (which is one
        // way) until they found the password. 
        // because a random salt is used for every password, they'd have to do this with every passwod and salt combo
        // which is computationally intensive

        const salt = await bcrypt.genSalt(10);
        // Encrypt user password
        encryptedUserPassword = await bcrypt.hash(password, salt);

        // Create user in our database
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            username: username, // sanitize
            password: encryptedUserPassword
        });
        // sanitize user object returned to frontend
        const userInformation = { 
            "firstName": user.first_name,
            "lastName": user.last_name,
            "username": user.username
        }
        return res.status(201).json(userInformation);
    } catch (err) {
        console.log(err);
    }
};

// login a user
exports.login = async function (req, res) {
    try {
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password) ) {
            res.status(400).send("All input is required");
        }

        // Validate if user exists in our database
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, username },
                process.env.TOKEN_KEY,
                { expiresIn: "15m" }
            );
            const refreshToken = jwt.sign({ 
                user_id: user._id, username },
                process.env.REFRESH_TOKEN_KEY, 
                { expiresIn: '7d' }
            );

            const userInformation = { 
                "token": token,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "username": user.username
            }
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });

            // Send back user and token
            return res.status(200).json(userInformation);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
}

// refresh auth token
exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const user = await User.findById(payload.user_id);
        const username = user.username;
        const newAccessToken = jwt.sign(
            { user_id: user._id, username },
            process.env.TOKEN_KEY,
            { expiresIn: "15m" }
        );
        return res.json({ accessToken: newAccessToken });
    } catch {
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
}

// clear cookies
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true });
}

// return the user profile information
exports.profile = async function(req, res) {
    try {
        // Get id of authenticated user
        const id = req.userId;
        // Validate if user exists in our database
        const user = await User.findById(id);
        // User profile information
        const userInformation = { 
            "firstName": user.first_name,
            "lastName": user.last_name,
            "username": user.username
        }
        return res.status(200).json(userInformation);
    } catch (err) {
        console.log(err);
    }
}

// Delete User
exports.delete_user = async (req, res) => {
  const deleted = await User.findOneAndDelete({ 
    _id: req.userId
  });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
}