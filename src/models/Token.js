import mongoose, { models } from "mongoose";

const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    default: new Date(Date.now().getTime() + 5 * 60000),
  },
});

export default model("tokens", tokenSchema)