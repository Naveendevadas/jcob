'use strict';

module.exports = {
  up: (models, mongoose) => {
   
      return models.category.insertMany([
        {
          _id : "6745292e70676e312caf9ea5",
          category : "ROLEX"
        },
        {
           _id : "67452a5a70676e312caf9ea6",
          category : "JCOBANDCO"
        },
        {
           _id : "67452a7370676e312caf9ea7",
          category : "PATECK PHILIPPE"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    
      return models.category.deleteMany(
        {
          _id : {
            $in : [
              "6745292e70676e312caf9ea5",
              "67452a5a70676e312caf9ea6",
              "67452a7370676e312caf9ea7"
  
            ]
          }
        }
      ).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
