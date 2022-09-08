import express from "express";
import {
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postDeleteProduct,
  postEditProduct,
} from "../controllers/admin.controller.js";

import { body } from "express-validator";
import { isAuth } from "../../middlewares/isAuth.js";

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.post(
  "/add-product",
  isAuth,
  [
    body("title", "title must contain at least 3 alphanumeric characters")
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl", "Image should have a valid url").isURL(),
    body("price").isFloat(),
    body(
      "description",
      "description should be between 5 and 400 characters long"
    )
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  postAddProduct
);
router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "title must contain at least 3 alphanumeric characters")
      .isLength({ min: 3 })
      .trim(),
    body("imageUrl", "Image should have a valid url").isURL(),
    body("price", "price must be a decimal number").isFloat(),
    body(
      "description",
      "description should be between 5 and 400 characters long"
    )
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  postEditProduct
);

router.get("/products", isAuth, getAdminProducts);
router.get("/edit-product/:productId", isAuth, getEditProduct);
router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
