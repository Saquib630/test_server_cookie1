const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

// Temporary database.
// Later replace this with MongoDB.
const users = [];

// ========================
// HOME
// ========================

const home = async (req, res) => {
    try {
        const sessionId = req.cookies.user_session;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "User is not logged in"
            });
        }

        const user = users.find(
            user => user.sessionId === sessionId
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid session"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is logged in",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================
// REGISTER
// ========================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            sessionId: null
        };

        users.push(user);
        console.log(user);
        

        return res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================
// LOGIN
// ========================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create session ID
        const sessionId = uuidv4();

        user.sessionId = sessionId;
        
        // Save cookie in browser
        res.cookie("user_session", sessionId, {
            httpOnly: true,

            // 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000,

            // localhost development
            secure: false,
            
            // Good for localhost setup
            sameSite: "lax",
            
            path: "/"
        });
        
        console.log("data send to frounted login " + sessionId );

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================
// LOGOUT
// ========================

const logout = async (req, res) => {
    try {

        const sessionId = req.cookies.user_session;

        if (sessionId) {

            const user = users.find(
                user => user.sessionId === sessionId
            );

            if (user) {
                user.sessionId = null;
            }
        }

        res.clearCookie("user_session", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    home,
    register,
    login,
    logout
};