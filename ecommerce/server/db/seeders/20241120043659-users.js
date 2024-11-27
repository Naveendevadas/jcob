

'use strict';

const user_type = require("../models/user_type");
module.exports = {
  up: (models, mongoose) => {
  
      return models.user_type.insertMany([
        {
          _id:"6744900ea12e7f377187c840",
          user_type:"admin"
        },
        {
          _id:"6744904aa12e7f377187c841",
          user_type:"buyer"
        },
        {
          _id:"6744906fa12e7f377187c842",
          user_type:"seller"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  
  },

  down: (models, mongoose) => {
    
      return models.user_type.deleteMany({
        _id : {
          $in :[
           "6744900ea12e7f377187c840" ,
           "6744904aa12e7f377187c841" ,
           "6744906fa12e7f377187c842"
        
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
