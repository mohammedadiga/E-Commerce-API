import mongoose from "mongoose";


export default function dbConnection(){

    try {

        const connection = mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connection Successfully");

    } catch (error) {
        console.log("Database Connection Error");
    }

}
