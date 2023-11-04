import mongoose from "mongoose";


export default async function connect(){
    const db = await mongoose.connect(process.env.MONGO_STRING)
}
