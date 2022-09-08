import express from "express";
import {
  addToCart,
  getCart,
  //   // getCheckout,
  getIndexPage,
  getOrders,
  getProduct,
  getProducts,
  postCartDeleteProduct,
  postCreateOrder,
} from "../controllers/shop.controller.js";

import { isAuth } from "../../middlewares/isAuth.js";

const router = express.Router();

router.get("/", getIndexPage);
router.get("/products", getProducts);
router.get("/products/:productId", getProduct);
router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, addToCart);
// // router.get("/checkout", getCheckout);
router.get("/orders", isAuth, getOrders);
router.post("/cart-delete-item", isAuth, postCartDeleteProduct);
router.post("/create-order", isAuth,postCreateOrder);

export default router;
