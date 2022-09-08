import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

export const getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    errorMessage: req.flash("error")[0],
  });
};

export const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    title: "Signup",
    errorMessage: req.flash("error")[0],
  });
};

export const postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already in use, please pick a different one");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "uzor.nwachukwu@thebulbafrica.institute",
            subject: "Signup completed",
            html: "<h1>You Successfully Signed UP</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .catch((err) => {
      console.log(err);
    });
};

export const postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((passwordsMatch) => {
          if (!passwordsMatch) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
          }
          req.session.user = user;
          req.session.isLoggedIn = true;

          return req.session.save((err) => {
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
};

export const getResetPassword = (req, res) => {
  res.render("auth/reset", {
    path: "/reset",
    title: "Reset Password",
    errorMessage: req.flash("error")[0],
  });
};

export const postReset = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "uzor.nwachukwu@thebulbafrica.institute",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to reset your password
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

export const getNewPassword = (req, res) => {
  const { token } = req.params;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/reset",
        title: "Reset Password",
        errorMessage: req.flash("error")[0],
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postNewPassword = (req, res) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.passwordToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
