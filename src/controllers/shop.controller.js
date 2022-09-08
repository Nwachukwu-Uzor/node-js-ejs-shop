import Product from "../models/product.js";
import Order from "../models/order.js";

export const getProducts = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        title: "Shop || Product",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId).then((product) => {
    res.render("shop/product-detail", {
      product,
      title: "Detail",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

export const getIndexPage = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        title: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

export const getCart = (req, res) => {
  const { isLoggedIn } = req.session;

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        title: "Cart 🛒",
        products,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postCartDeleteProduct = (req, res) => {
  const { user } = req;
  const { productId } = req.body;
  user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

export const addToCart = (req, res) => {
  const { productId } = req.body;
  const { user } = req;
  Product.findById(productId)
    .then((product) => {
      return user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

// export const getCheckout = (req, res) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     title: "Checkout ✅",
//   });
// };

export const getOrders = (req, res) => {
  const { isLoggedIn } = req.session;
  const { user } = req;

  Order.find({ "user.userId": user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        title: "Shop orders",
        path: "/orders",
        orders,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postCreateOrder = (req, res) => {
  const { user } = req;

  user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });

      const order = new Order({
        user: { email: user.email, userId: user },
        products,
      });

      return order.save();
    })
    .then(() => {
      return user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
