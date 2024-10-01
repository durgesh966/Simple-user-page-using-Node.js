const { generateToken, verifyToken } = require("./jwt");
const db = require("../db/connection");
const bcrypt = require("bcrypt");
const { transporter } = require("./mail");

const getAllUserData = async (req, res) => {
    try {
        db.query('SELECT * FROM user', (err, result) => {
            if (err) {
                return res.status(500).send({
                    type: "error",
                    message: "error dur9ing selecting user data",
                    error: err
                });
            }
            return res.status(200).send({
                type: "Success",
                message: "user record fatched successfull",
                userData: result
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            type: "error",
            message: "Server error",
            error: err
        });
    }
};

const userSignupForm = async (req, res) => {
    try {
        const { First_name, Last_name, Email, Password } = req.body;
      
        db.query('SELECT * FROM user WHERE Email = ?', [Email], (err, result)=>{
         if(!err){
            res.status(200).send({
                type:"sucess",
                message:"Email Alredy Exist plese login."
            })
         }
        });

        const hashPass = await bcrypt.hash(Password, 10);
        db.query('INSERT INTO user (First_name, Last_name, Email, Password) VALUES (?, ?, ?, ?)',
            [First_name, Last_name, Email, hashPass], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        type: "error",
                        message: "error during creating user",
                        error: err
                    })
                };
                res.status(200).send({
                    type: "Success",
                    message: "User Rgistration Successfull",
                    data: result
                });
            });

    } catch (err) {
        console.log(err);
        res.send({
            status: 500,
            type: "error",
            message: "Server error",
            error: err
        });
    }
};

const userLoginForm = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            res.status(300).send({
                type: "error",
                message: "please enter user email and password"
            });
        }
        db.query('SELECT * FROM user WHERE Email = Email', [Email], async (err, result) => {
            if (err) {
                res.status(500).send({
                    type: "error",
                    message: "User Data not found",
                    error: err
                });
            }
            const match = await bcrypt.compare(Password, result[0].Password)
            if (match) {
                const JWTdata = {
                    Name: result[0].First_Name,
                    Email: result[0].Email
                };
                const token = generateToken(JWTdata);
                req.session.token = token;
                return res.status(200).send({
                    type: "Success",
                    message: "User login Successfull",
                    token: token
                });
            }
            return res.status(200).send({
                type: "err",
                message: "User password is not match"
            })
        });
    } catch (err) {
        console.log(err);
        res.send({
            status: 500,
            type: "error",
            message: "Server error",
            error: err
        });
    }
};

const forgatePassword = async (req, res) => {
    try {
        const { Email } = req.body;
        const send = transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "webdev.durgesh@gmail.com",
            subject: "Forgate your password",
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>your forgat password link is</h2>
            <p>link is <strong>http://localhost:3000/createnewpassword/${Email}</strong></p>
            <p>Thank you! This link is automatically hide in 5 min.</p>
            <br>
            <p>Online Book Store</p>
        </div>`
        })

        if(send){
            return res.status(200).send({
                type:"success",
                message:`forgate password link send Successfull on ${Email}`
            })
        }
    } catch (err) {
        console.log(err);
        res.send({
            status: 500,
            type: "error",
            message: "Server error",
            error: err
        });
    }
}

const createNewPassword = async (req, res) => {
    try {
        const Email = req.params;
        const { newpass, confnewpass } = req.body;

        if (newpass !== confnewpass) {
            return res.status(400).send({
                type: "error",
                message: "given password dose not math plese check again",
            });
        };
        const newHasPass = await bcrypt.hash(newpass, 10);

        db.query('UPDATE user SET Password = ? WHERE Email = ?', [newHasPass, Email.Email], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    type: "error",
                    message: "User data not found",
                    error: err
                });
            }
            return res.status(200).send({
                type: "Success",
                message: "Password update successfull",
                data: result
            });
        });

    } catch (err) {
        console.log(err);
        res.send({
            status: 500,
            type: "error",
            message: "Server error",
            error: err
        });
    }
}

module.exports = { getAllUserData, userSignupForm, userLoginForm, forgatePassword, createNewPassword };