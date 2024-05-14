import mongoose from "mongoose";

const EmailConfigModel = new mongoose.Schema({
  hostName: {
    type: String,
    default: "smtp.gmail.com"
  },
  portNumber: {
    type: Number,
    default: 587
  },
  serviceName: {
    type: String,
    default: "gmail"
  },
  serviceEmail: {
    type: String,
    default: "kctech4you@gmail.com"
  },
  emailPassword: {
    type: String,
    default: "fkqytacytithclcu"
  }
}, { timestamps: true });

export const EmailConfig = mongoose.model("EmailConfig", EmailConfigModel);
