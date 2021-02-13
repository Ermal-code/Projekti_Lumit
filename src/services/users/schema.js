const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: String,
    surname: String,
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    total: Number,
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);

module.exports = UserModel;
