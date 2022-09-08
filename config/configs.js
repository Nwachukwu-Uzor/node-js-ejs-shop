import dotenv from "dotenv";
dotenv.config()

export const sendgridApiKey = process.env.SENDGRID_API_KEY;
export const sendgridEmail = process.env.SENDGRID_API_EMAIL;
export const mongoDbUri = process.env.MONGODB_URI;
