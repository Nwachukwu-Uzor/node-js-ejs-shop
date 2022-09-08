import Product from "../models/product.js";

export const getAddProduct = (req, res) => {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    title: "Add Product",
    path: "/admin/add-product",
    editing: false,
    product: {},
    isAuthenticated: isLoggedIn,
  });
};

export const postAddProduct = (req, res) => {
  const { title, description, imageUrl, price } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEditProduct = (req, res) => {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
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
      res.render("admin/edit-product", {
        title: "Add Product",
        path: "/edit/add-product",
        editing: edit,
        product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body;

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
    });
};

export const getAdminProducts = (req, res) => {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        products,
        title: "Products",
        path: "/admin/products",
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteOne({_id: productId, userId: req.user._id})
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
