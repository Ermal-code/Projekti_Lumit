const router = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("./schema");
const ProductModel = require("../products/schema");

// router.post("/", async (req, res, next) => {
//   try {
//     const newUsers = new UserModel(req.body);
//     const { _id } = await newUsers.save();
//     res.status(201).send(_id);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

router.get("/:userId", async (req, res, next) => {
  try {
    const cart = await UserModel.findById(req.params.userId).populate("cart", {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    if (cart) {
      res.status(200).send(cart);
    } else {
      const err = new Error();
      err.message = `User id: ${req.params.userId} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:userId/addToCart/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    const cart = await UserModel.findByIdAndUpdate(req.params.userId, {
      $push: { cart: mongoose.Types.ObjectId(req.params.productId) },
      $inc: { total: product.price },
    });
    if (cart) {
      res.status(201).send(cart);
    } else {
      const err = new Error();
      err.message = `User id: ${req.params.userId} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:userId/removeFromCart/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.productId);
    const cart = await UserModel.findOneAndUpdate(
      { _id: req.params.userId, cart: req.params.productId },
      {
        $unset: { "cart.$": true },
        $inc: { total: -product.price },
      }
    );

    await UserModel.findByIdAndUpdate(req.params.userId, {
      $pull: { cart: null },
    });
    if (cart) {
      res.status(203).send("Product deleted");
    } else {
      const err = new Error();
      err.message = `User id: ${req.params.userId} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
