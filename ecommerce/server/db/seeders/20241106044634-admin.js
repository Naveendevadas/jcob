'use strict';
const bcrypt = require("bcrypt");
const user_Model = require ('../models/Admin')

module.exports = {
  up: (models, mongoose) => {
    // Plain password
    let password = "admin123";
    
    // Hashing the password
    let salt = bcrypt.genSaltSync(10);
    const hashed_pass = bcrypt.hashSync(password, salt);

    // Insert the new user with hashed password
    return models.Admin.insertMany([
      {
        "name": "admin",
        "email": "admin@gmail.com",
        "password": hashed_pass,
        "user_type": "6744900ea12e7f377187c840" // Reference to user type (Admin)
      }
    ])
    .then(res => {
      console.log(res.insertedCount); // Should log the number of inserted documents (usually 1)
    })
    .catch(err => {
      console.error('Error inserting user:', err);
    });
  },

  down: (models, mongoose) => {
    // Deleting the user by email (or user type if needed, but email makes more sense here)
    return models.Admin.deleteMany({
      email: "admin@gmail.com" // Use the email to identify the user for deletion
    })
    .then(res => {
      console.log(res.deletedCount); // Should log the number of deleted documents (usually 1)
    })
    .catch(err => {
      console.error('Error deleting user:', err);
    });
  }
};
