import express from "express";
import { check, body } from "express-validator";

import {
  getLogin,
  getNewPassword,
  getResetPassword,
  getSignup,
  postLogin,
  postLogout,
  postNewPassword,
  postReset,
  postSignup,
} from "../controllers/auth.controller.js";

import User from "../models/user.js";

const router = express.Router();

router.get("/login", getLogin);
router.get("/signup", getSignup);
router.post(
  "/login",
  [
    body("email", "Please enter a valid email address").isEmail().normalizeEmail(),
    body("password", "Passwords must be at least 5 characters long").isLength({
      min: 5,
    }).trim(),
  ],
  postLogin
);
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email")
      .isEmail()
      .custom((value, { _req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exists, please enter a different email"
            );
          }
        });
      }).normalizeEmail(),
    body("password", "Password need to be at least 5 characters").isLength({
      min: 5,
    }).trim(),
    body("confirmPassword").trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
  ],
  postSignup
);
router.post("/logout", postLogout);
router.get("/reset", getResetPassword);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/reset/:token", postNewPassword);

export default router;
