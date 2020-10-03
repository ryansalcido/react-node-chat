require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");
const apiErrorHandler = require("./middlewares/apiErrorHandler");
const baseRouter = require("./routes");

app.use(helmet());
app.use(express.json());

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log("Error connecting to database: ", error));
db.once("open", () => console.log("Connected to database"));

app.use("/chat/api", baseRouter);
app.use(apiErrorHandler);

const publicPath = path.join(__dirname, "build");
app.use("/chat", express.static(publicPath));
app.use("/chat/*", express.static(publicPath));

app.listen(process.env.CHAT_NODE_PORT, () => console.log(`Server running on port ${process.env.CHAT_NODE_PORT}`));
