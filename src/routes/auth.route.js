import express from "express";
import { check} from "express-validator"

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

const router = express.Router();

router.get("/login", getLogin);
router.get("/signup", getSignup);
router.post("/login", postLogin);
router.post("/signup", check('email').isEmail(), postSignup);
router.post("/logout", postLogout);
router.get("/reset", getResetPassword);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/reset/:token", postNewPassword);

export default router;
