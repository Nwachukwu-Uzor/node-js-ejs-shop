import express from "express";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import connectMongodbSession from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import multer from "multer";

import { get404, get500 } from "./src/controllers/error.controller.js";
import User from "./src/models/user.js";
import adminRoute from "./src/routes/admin.route.js";
import shopRoute from "./src/routes/shop.route.js";
import authRoute from "./src/routes/auth.route.js";

import { mongoDbUri } from "./config/configs.js";

const MONGODB_URI = mongoDbUri;
const app = express();
const __dirname = path.resolve();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimeType === "image/png" ||
    file.mimeType === "image/jpg" ||
    file.mimeType === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MongobDBStore = connectMongodbSession(session);

const store = new MongobDBStore({ uri: MONGODB_URI, collection: "sessions" });
app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
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
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use("/admin", adminRoute);
app.use("/", shopRoute);
app.use(authRoute);

app.get("/500", get500);

app.use(get404);

app.use((error, req, res, next) => {
  res.render("500", {
    title: "Error",
    path: "/500",
    isAuthenticated: req.session?.isLoggedIn,
  });
});

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
