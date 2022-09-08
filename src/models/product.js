import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model("Product", productSchema);

// import { ObjectId } from "mongodb";
// import { getDb } from "../utils/database.js";

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     let dbOp;
//     const db = getDb();

//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(productId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(productId) })
//       .then((result) => {
//         console.log("Deleted");
//       })
//       .catch((err) => {
//         cons;
//       });
//   }
// }
// export default Product;
