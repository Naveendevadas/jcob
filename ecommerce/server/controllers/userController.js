const users = require('../db/models/users');
const user_type = require("../db/models/user_type");
const category = require("../db/models/category")
const bcrypt = require('bcrypt');
const { success_function, error_function } = require("../utils/responseHandler");
const mongoose = require("mongoose");
const uploadBase64Images = require("../utils/file-upload").uploadBase64Images;
const Products = require('../db/models/Products');
const { count } = require('console');
const jwt = require('jsonwebtoken');
const Cart = require('../db/models/cart')

exports.createuser = async (req, res) => {
    try {
        let body = req.body;
        console.log("Received body:", body);

        let password = body.password;
        let user_type_value = body.user_type;


        if (!user_type_value) {
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "User type is required"
            }));
        }


        user_type_value = user_type_value.toLowerCase().trim();


        const UserType = await user_type.findOne({ user_type: user_type_value });

        if (!UserType) {
            console.log("User type not found:", user_type_value);
            return res.status(400).send(error_function({
                statusCode: 400,
                message: "Invalid user type"
            }));
        }

        console.log("UserType found:", UserType);


        let salt = bcrypt.genSaltSync(10);
        let hashed_password = bcrypt.hashSync(password, salt);

        let email_ing = body.email;
        //check email

        let existingUser = await users.countDocuments({ email: email_ing });
        console.log("count : ", existingUser)
        if (existingUser > 0) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Email Already Exist"
            });
            res.status(response.statusCode).send(response);
            return;
        }




        let randombody = {
            // name: body.name,
            email: body.email,
            password: hashed_password,
            // phoneno: body.phoneno,
            user_type: UserType._id,
        };


        let new_user = await users.create(randombody);

        if (new_user) {
            const response = success_function({
                statusCode: 200,
                message: "User created successfully",
                data: new_user
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            console.log("User creation failed");
            res.status(400).send(error_function({
                statusCode: 400,
                message: "User creation failed"
            }));
            return;
        }

    } catch (error) {
        console.log("Error in createuser:", error);
        res.status(500).send(error_function({
            statusCode: 500,
            message: error.message || "Something went wrong"
        }));
        return;
    }
};

exports.getUserTypes = async function (req, res) {
    try {
        let selectUserTypes = await user_type.find();


        if (selectUserTypes) {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "successfully fetched the userTypes",
                data: selectUserTypes
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log('error', error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "userType fetching failed",

        });
        res.status(response.statusCode).send(response)
        return;
    }

}

exports.getAllUsers = async function (req, res) {
    try {
        // Fetch all users from the database
        let user = await users.find().populate({ path: "user_type", select: "-__v" });

        // Log the retrieved users
        console.log("Fetched users:", user);

        // Check if users were found
        if (!user || user.length === 0) {
            let response = {
                success: true,
                statusCode: 200,
                message: "No users found",
                data: []
            };
            res.status(response.statusCode).send(response);
            return;
        }

        // Send the users back to the client
        let response = {
            success: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: user
        };
        res.status(response.statusCode).send(response);

    } catch (error) {
        // Log the error
        console.log("Error fetching users:", error);

        // Send an error response
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Users fetching failed"
        });
        res.status(response.statusCode).send(response);
    }
};

exports.getSingleUser = async function (req, res) {
    try {
        const rawId = req.params.id; // Assuming `:id` is in the route as a parameter
        const id = rawId.replace(':id=', ''); // Remove the prefix if present

        // Validate the extracted ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Invalid ID format",
            });
        }

        // Query the database
        const user = await users.findById(id).populate({ path: "user_type", select: "-__v" }); // Replace `users` with your actual model name

        if (!user) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "User not found",
            });
        }

        // Return the user data
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);

        // Handle server errors
        return res.status(500).send({
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
    }
};

exports.addProducts = async function (req, res) {
    try {
        console.log("Request Body:", req.body);
        console.log("Seller ID:", req.params.id);

        const body = req.body;

        const sellerID = req.params.id;

        // Validate seller ID
        if (!sellerID) {
            return res.status(400).send({ success: false, message: "Seller ID is required" });
        }

        // Validate category
        const matchedCategory = await category.findOne({ category: req.body.category });
        if (!matchedCategory) {
            return res.status(400).send({ success: false, message: "Invalid category" });
        }

        // Handle base64-encoded images
        
        let image = [];
        if (req.body.image && Array.isArray(req.body.image)) {
            image = await uploadBase64Images(req.body.image, sellerID, req.body.altText);
        } else {
            return res.status(400).send({ success: false, message: "No images provided" });
        }

        // Create the new product
        const newProduct = new Products({
            sellerID,
            name: body.name,
            stock : body.stock,
            price: body.price,
            category: matchedCategory._id,
            image,
        });

        // Save to database
        const productDetails = await newProduct.save();
        return res.status(200).send({
            success: true,
            message: "Product added successfully",
            data: productDetails,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).send({ success: false, message: "Product adding failed, please try again." });
    }
};

exports.getAllProducts = async function (req, res) {
    try {
        let productData = await Products.find()
            .populate({ path: "category", })
            .select("-__v");

        console.log("productData:", productData);

        // Send a structured response
        res.status(200).send({
            success: true,
            data: productData,
        });
    } catch (error) {
        console.error("Error fetching products:", error);

        // Send error with a structured response
        res.status(500).send({
            success: false,
            message: error.message || "An unexpected error occurred",
            ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
        });
    }
};

exports.singleProduct = async function (req, res) {
    try {
        const proId = req.params.id;
        const id = proId.replace(':id=', '');

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Invalid ID format",
            });
        }

        const product = await Products.findById(id).populate({ path: "category", select: "-__v" });

        if (!product) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "product not found"
            });
            res.status(response.statusCode).send(response);
            return;
        }
        else {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "product fetch succesfull",
                data: product,

            });
            res.status(response.statusCode).send(response);
            return;
        }



    } catch (error) {
        console.error("Error fetching product:", error);

        // Handle server errors
        return res.status(500).send({
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
    }

};

exports.getProductsBySeller = async (req, res) => {
    try {
      const sellerId = req.params.sellerId;
      console.log("Seller ID received:", sellerId); // Log received sellerId
      const products = await AddData.find({ sellerID: sellerId });
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this seller." });
      }
  
      return res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error); // Log error details
      return res.status(500).json({ message: "Server error", error });
    }
  };
  



