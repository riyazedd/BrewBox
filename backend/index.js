import path from 'path'
import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
import productRoutes from './routes/productRoute.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoute.js'
import cors from 'cors'
import { checkAndUpdateSubscriptionDeliveries } from './utils/subscriptionDeliveryScheduler.js'



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

checkAndUpdateSubscriptionDeliveries();



app.get('/',(req,res)=>{
    res.send('API is running')
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.listen(PORT,()=>console.log("Server running on port: "+PORT))

