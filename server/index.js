require("dotenv").config();
const db = require("./db");
const app = require("./express");

db.connect(process.env.MONGODB_URL);

app.listen(process.env.CHAT_NODE_PORT, () => console.log(`Server running on port ${process.env.CHAT_NODE_PORT}`));
