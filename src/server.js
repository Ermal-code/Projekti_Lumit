const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

const services = require("./services");

const {
  badRequestErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandlers");

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api", services);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(catchAllErrorHandler);

const port = process.env.PORT || 3003;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      if (process.env.NODE_ENV === "production") {
        console.log("Running on cloud on port", port);
      } else {
        console.log(`Running locally on url http://localhost:${port}`);
      }
    })
  )
  .catch((error) => console.log(error));
