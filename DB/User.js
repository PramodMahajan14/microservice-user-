const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("./connect");

async function countTables() {
  try {
    const query = `
      SELECT COUNT(*)
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

    const [results, metadata] = await sequelize.query(query);

    console.log("Number of tables in the public schema:", results[0].count);
  } catch (error) {
    console.error("Error executing query:", error);
  }
}
// async function truncateUserTable() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");

//     // Truncate the User table
//     await User.truncate({ cascade: true, restartIdentity: true });
//     console.log("User table has been truncated successfully.");
//   } catch (error) {
//     console.error("Error truncating User table:", error);
//   } finally {
//     await sequelize.close();
//   }
// }

// // Call the function to truncate the User table
// truncateUserTable();

// Call the function to count tables
countTables();

// Create a Sequelize instance

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "User", // Specify the table name
    timestamps: false, // Specify the correct schema name if not 'public'
    modelName: "User",
  }
);

module.exports = User;
