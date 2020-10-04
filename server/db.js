const mongoose = require("mongoose");

module.exports = {
  mongoose,
  connect: async (database) => {
    try {
      await mongoose.connect(
        database,
        { 
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        }
      );
      console.log("Connected to database");
    } catch (err) {
      console.log("Error connecting to database:", err);
    }
  },
  disconnect: async () => await mongoose.connection.close()
};
