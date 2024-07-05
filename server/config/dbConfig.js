import mongoose from "mongoose";

const dbConnect = async () => {
  const connect = await mongoose.connect(process.env.MONGO_DB_URI);
  console.log(`Database connected successfully at: ${connect.connection.host}`);
};

export default dbConnect;
