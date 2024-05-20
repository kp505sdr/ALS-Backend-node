import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
 name: String,
 profilepic: String,
  title: {
    type: String,
  },
  blogsDetails: {
    type: String,
  },
  image:{
    type: Array,
   
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);
