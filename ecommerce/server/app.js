const express=require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const mongoConnect=require('./db/connect')
const userRoutes = require('./routes/userRoutes');
const authRoutes =require('./routes/authRoutes')

app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

app.use(express.static( "../client"));
app.use("/upload",express.static("./upload"));


mongoConnect();

app.use(express.json({ limit: "100mb" }));


app.use(express.urlencoded({extended : true}));

app.use(userRoutes);
app.use(authRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
