const jwt=require('jsonwebtoken');

const Cart=require('../db/models/cart');
const Products=require('../db/models/Products')
const mongoose=require('mongoose')

const authenticate=(req,res,next)=>{
const token=req.header('Authorization')?.replace('Bearer','').trim();
console.log("token",token)

if(!token){
    return res.status(401).json({message:"no token..please login"});
}

try{
    const decoded=jwt.verify(token,process.env.PRIVATE_KEY);
    req.user={id:decoded.user_id};
    console.log("decode",req.user.id)
    next();
}
catch(error){
    return res.status(401).send({ message: 'Invalid or expired token.' });
}
};

exports.addToCart=[authenticate,async(req,res)=>{

try{
    const userId=req.user.id;
    const{productId}=req.body;


    const product=await Products.findById(productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
  }
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      } 

      let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.items.find(item => item.productId.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in cart' });
    }

    cart.items.push({ productId, });
    await cart.save();

    return res.status(200).json({ message: 'Product added to cart', cart });

    
}
catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}

}  
];

// view cart
exports.getCart = [
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ message: "Cart is empty", items: [] });
      }

      // Filter out items where productId is null
      const validItems = cart.items.filter((item) => item.productId !== null);

      return res
        .status(200)
        .json({ message: "Cart fetched successfully", items: validItems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
];

  
  