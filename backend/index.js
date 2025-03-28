import express from 'express'
import dotenv from "dotenv"
dotenv.config()
import connectDB from './config/db.js'

const PORT = process.env.PORT || 3000

connectDB();

const app = express();

app.get('/',(req,res)=>{
    res.send('API is running')
})

app.listen(PORT,()=>console.log("Server running on port: "+PORT))