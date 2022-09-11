import Product from "../models/product.js";
import { validationResult } from "express-validator";

export const getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: {},
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

export const postAddProduct = (req, res, next) => {
  const { title, description, image, price } = req.body;

  const imageUrl = req.file;
  console.log(req.file)

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      title: "Add Product",
      path: "/admin/add-product",
      editing: false,
      product: { title, price, description, image },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    price,
    description,
    image,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

export const getEditProduct = (req, res) => {
  const { edit } = req.query;

  if (!edit) {
    return res.redirect("/");
  }

  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      return res.render("admin/edit-product", {
        title: "Add Product",
        path: "/edit/add-product",
        editing: edit,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  const { productId, title, description, price, image } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render(`admin/edit-product`, {
      title: "Editing Product",
      path: "/admin/edit-product",
      editing: true,
      product: { title, price, description, image, _id: productId },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;

      return product.save().then((_result) => {
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

export const getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        products,
        title: "Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

export const postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
