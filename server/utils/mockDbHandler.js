const { MongoMemoryServer } = require("mongodb-memory-server");
const db = require("../db");

const server = new MongoMemoryServer();

/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
  const url = await server.getUri();
  await db.connect(url);
};

/*
 * Disconnects from and destroys the mongo test database in memory
 */
const destroyDB = async () => {
  await db.disconnect();
  await server.stop();
};

module.exports = { createDB, destroyDB };
