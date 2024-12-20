const express=require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const mongoConnect=require('./db/connect')
const userRoutes = require('./routes/userRoutes');
const authRoutes =require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const path = require('path')


app.use(cors())
app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

app.use(express.static( "../client"));
app.use("/upload",express.static(path.join("./upload")));


mongoConnect();

app.use(express.json({ limit: "1000mb" }));


app.use(express.urlencoded({extended : true}));

app.use(userRoutes);
app.use(authRoutes);
app.use(cartRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
