import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];

  let newQuantity = 1;

  if (cartProductIndex > -1) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = { items: updatedCartItems };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

export default model("User", userSchema);

// import { ObjectId } from "mongodb";
// import { getDb } from "../utils/database.js";

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(id) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const db = getDb();
//
//   }

//   getCart() {
//     const db = getDb();
//     const ids = this.cart.items.map((it) => it.productId);
//     return db
//       .collection("products")
//       .find({ _id: { $in: ids } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => {
//           return {
//             ...prod,
//             quantity: this.cart.items.find((it) => {
//               return it.productId.toString() === prod._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const db = getDb();

//     const updatedCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//             email: this.email,
//           },
//         };

//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }
// }

// export default User;
