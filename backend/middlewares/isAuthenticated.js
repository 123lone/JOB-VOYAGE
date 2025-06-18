import jwt from "jsonwebtoken";

const Authenticate = async (req, res, next) => {
    try {
        let token;
        // Prioritize Authorization header for Bearer token
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            // Fallback to cookie if no Bearer token
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        if (!decode || !decode.userId) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.userId; // Set user ID for downstream use
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
            error: error.message,
        });
    }
};

export default Authenticate;