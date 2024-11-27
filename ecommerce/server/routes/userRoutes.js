const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController')

router.post('/users',userController.createuser),
router.post('/addproduct',userController.addProducts)
router.get('/getallusers',userController.getAllUsers)
router.get('/getallproducts',userController.getAllProducts)
router.get('/getSingleUser/:id',userController.getSingleUser)

module.exports=router