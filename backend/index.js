import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoute.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

connectDB();

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cookie parser middleware
app.use(cookieParser());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT,()=>console.log("Server running on port: "+PORT))