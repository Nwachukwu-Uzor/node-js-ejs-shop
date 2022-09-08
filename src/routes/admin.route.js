import express from "express";
import {
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct,
} from "../controllers/admin.controller.js";

import { isAuth } from "../../middlewares/isAuth.js";

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.post("/add-product",  isAuth,postAddProduct);
router.post("/edit-product", isAuth,postEditProduct);

router.get("/products", isAuth, getAdminProducts);
router.get("/edit-product/:productId", isAuth, getEditProduct);
router.post("/delete-product", isAuth,postDeleteProduct);

export default router;
