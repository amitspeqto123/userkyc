import mongoose from "mongoose";

export const databaseConnectionKYc = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully of User KYC")
    }catch(error){
        console.log("Database connection failed of User KYC");
    }
}