const jwt = require("jsonwebtoken");

const generateToken = (JWTdata) => {
    return jwt.sign(JWTdata, process.env.JWT_SECRET, { expiresIn: "2h" });
};

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization
    if (!authorization) {
        return res.status(401).send({
            type: "error",
            message: "Token not Found"
        });
    };
    if (!token) {
        return res.status(401).send({
            type: "error",
            message: "unauthorized user"
        });
    };
    try {
        const decod = jwt.verify(token, process.env.JWT_SECRET);
        req.token = decod;
        next();
    } catch (err) {
        console.log(err);
        res.send({
            status: 500,
            type: "error",
            message: "Error during verify user",
            error: err
        });
    }
};

module.exports = { generateToken, verifyToken };
