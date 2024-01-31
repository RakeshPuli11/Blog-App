import express from 'express';
import mongoose from 'mongoose';
import router from './routes/userrouter.js';
import brouter from './routes/blogrouter.js';
const app = express();
app.use(express.json())
app.use("/user",router);
app.use("/blog",brouter);
mongoose.connect("mongodb+srv://rootx<password>@clusterx.kdlzipo.mongodb.net/ChatApp?retryWrites=true&w=majority")
.then((result) => {
    app.listen(3000);
}).catch((err) => {
    console.log(err);
});