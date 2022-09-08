import express from "express";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import connectMongodbSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash"

import { get404 } from "./src/controllers/error.controller.js";
import User from "./src/models/user.js";
import adminRoute from "./src/routes/admin.route.js";
import shopRoute from "./src/routes/shop.route.js";
import authRoute from "./src/routes/auth.route.js";

const MONGODB_URI =
  "mongodb+srv://uzor:lgCiuWjm5P7qTw9W@cluster0.4p5te.mongodb.net/shop?retryWrites=true&w=majority";
const app = express();
const __dirname = path.resolve();

const MongobDBStore = connectMongodbSession(session);

const store = new MongobDBStore({ uri: MONGODB_URI, collection: "sessions" });

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
const csrfProtection = csrf();

app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/admin", adminRoute);
app.use("/", shopRoute);
app.use(authRoute);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log("app is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
