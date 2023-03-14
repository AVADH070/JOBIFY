import mongoose from "mongoose";

const connectDB = (url) => {
    return mongoose.connect(url).then(() => console.log("Connecting Server...")).catch((err) => console.log(err));
}

export default connectDB