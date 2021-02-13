const router = require("express").Router();
const ProductModel = require("./schema");

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductModel.find();

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.status(200).send(product);
    } else {
      const err = new Error();
      err.message = `Product id: ${req.params.id} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductModel(req.body);
    const { _id } = await newProduct.save();

    res.status(201).send(newProduct);
  } catch (error) {
    console.log(error);
    next(products);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const modifyProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifyProduct) {
      res.status(200).send(modifyProduct);
    } else {
      const err = new Error();
      err.message = `Product id: ${req.params.id} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id, {
      runValidators: true,
    });
    if (deleteProduct) {
      res.status(203).send("Product deleted");
    } else {
      const err = new Error();
      err.message = `Product id: ${req.params.id} not found!`;
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
