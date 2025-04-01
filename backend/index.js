import express from 'express'
import dotenv from "dotenv"
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoute.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

connectDB();

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL
}))

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT,()=>console.log("Server running on port: "+PORT))