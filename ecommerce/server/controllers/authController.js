// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const { success_function, error_function } = require('../utils/responseHandler');
// const User = require('../db/models/users');
// const Admin = require('../db/models/Admin');

// dotenv.config();

// // Helper function for authentication
// const authenticate = async (email, password, model, role, tokenExpiry) => {
//     // Check if the email exists in the database
//     const account = await model.findOne({ email });
//     if (!account) return { success: false, statusCode: 404, message: `${role} not found` };

//     // Validate the password
//     const isPasswordMatch = await bcrypt.compare(password, account.password);
//     if (!isPasswordMatch) {
//         return { success: false, statusCode: 401, message: "Incorrect password" };
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: account._id, role }, process.env.PRIVATE_KEY, { expiresIn: tokenExpiry });

//     return {
//         success: true,
//         statusCode: 200,
//         message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
//         data: { account, token },
//     };
// };

// // Login function for users
// exports.userLogin = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send(
//             error_function({
//                 success: false,
//                 statusCode: 400,
//                 message: "Email and password are required",
//             })
//         );
//     }

//     try {
//         const response = await authenticate(email, password, User, 'user', '10d');
//         if (!response.success) {
//             return res.status(response.statusCode).send(error_function(response));
//         }
//         return res.status(response.statusCode).send(success_function(response));
//     } catch (error) {
//         console.error("Error during user login:", error);
//         return res.status(500).send(
//             error_function({
//                 success: false,
//                 statusCode: 500,
//                 message: "An error occurred during user login",
//             })
//         );
//     }
// };

// // Login function for admins
// exports.adminLogin = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send(
//             error_function({
//                 success: false,
//                 statusCode: 400,
//                 message: "Email and password are required",
//             })
//         );
//     }

//     try {
//         const response = await authenticate(email, password, Admin, 'admin', '1h');
//         if (!response.success) {
//             return res.status(response.statusCode).send(error_function(response));
//         }
//         return res.status(response.statusCode).send(success_function(response));
//     } catch (error) {
//         console.error("Error during admin login:", error);
//         return res.status(500).send(
//             error_function({
//                 success: false,
//                 statusCode: 500,
//                 message: "An error occurred during admin login",
//             })
//         );
//     }
// };





const Admin = require("../db/models/Admin");
const users = require("../db/models/users"); // Use only one import for the user model
const { success_function, error_function } = require("../utils/responseHandler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        console.log("email:", email); 

        let user = await Admin.findOne({ email });
        console.log("admin user:", user);

        if (user) {
        
            const passwordMatch = bcrypt.compareSync(password, user.password);
            console.log("admin passwordMatch:", passwordMatch);

            if (passwordMatch) {
                const _id = user._id;
                const userType = user.user_type;
                const token = jwt.sign({ user_id: _id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                const data = {
                    token:token,
                    _id,
                    user_type: userType
                };

                const response = success_function({
                    statusCode: 200,
                    data,
                    message: "Admin login successful"
                });

                return res.status(response.statusCode).send(response);
            } else {
                return res.status(400).send(error_function({
                    statusCode: 400,
                    message: "Invalid admin password"
                }));
            }
        }

        // Step 2: If Admin login fails, try logging in as a regular user (buyer/seller)
        user = await users.findOne({ email }).populate(' user_type ')
        console.log("regular user:", user);

        if (user) {
            // Compare passwords for regular user (buyer/seller)
            const passwordMatch = bcrypt.compareSync(password, user.password);
            console.log("user passwordMatch:", passwordMatch);

            if (passwordMatch) {
                const _id = user._id;
                const userType = user.user_type; // Assuming user_type is stored in the User model
                const token = jwt.sign({ user_id: _id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                const data = {
                    token:token,
                    _id,
                    user_type: userType
                };

                const response = success_function({
                    statusCode: 200,
                    data,
                    message: "User login successful"
                });

                return res.status(response.statusCode).send(response);
            } else {
                return res.status(400).send(error_function({
                    statusCode: 400,
                    message: "Invalid user password"
                }));
            }
        }

        //  If both admin and user login fail
        return res.status(400).send(error_function({
            statusCode: 400,
            message: "User not found"
        }));

    } catch (error) {
        console.error("error:", error); //  for errors
        return res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
    }
};
