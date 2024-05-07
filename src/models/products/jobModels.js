import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  images: {
    type: Array,
  },
  description: {
    type: String,
  },
  category: {
    type: String,

  },
  subCategory: {
    type: String,
  
  },
  name: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactMobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  url: {
    type: String,
  },
  adExpDate: {
    type: Date,
  },
 
  tags: {
    type: Array,
    default: ['job'], 
  },
  isPaidAds: {
    type: Boolean,
    default: false,
  },
  subscrption: {
    type: String,
    default: "free",
  },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    profilepic: String,
    rating: {
        type: Number,
        required: true,
    },
    comment: {
      type: String,
    },
    timestamp: { type: Date, default: Date.now }
  }],
 totalRating:{
  averageRating :{
    type:Number
 },
 numberOfPeople:{
  type:Number
 }
 },
 
  likes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    profilepic: String,
    
    timestamp: { type: Date, default: Date.now }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    name: String,
    email: String,
    profilepic: String,
 
  reportCount: {
    type: Number,
    default: 0
},
reportedUsers: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who reported this comment
    default: []
},
  
  
    timestamp: { type: Date, default: Date.now }
  }],

  views: {
    type: Number,
  },
  createdBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
      },
    name: String,
    email: String,
    profilepic: String,
    socialMedia:Object,
    mobile:Number,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
  
});

export default mongoose.model("Job", jobSchema);
