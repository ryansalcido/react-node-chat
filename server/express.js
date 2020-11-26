require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const apiErrorHandler = require("./middlewares/apiErrorHandler");
const baseRouter = require("./routes");

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use("/chat/api", baseRouter);
app.use(apiErrorHandler);

const publicPath = path.join(__dirname, "build");
app.use("/chat", express.static(publicPath));
app.use("/chat/*", express.static(publicPath));

module.exports = app;
