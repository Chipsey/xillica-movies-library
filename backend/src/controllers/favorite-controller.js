const favoriteService = require("../services/favorite-service");
const logger = require("../utils/logger");

const toggleFavorite = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    const favorite = await favoriteService.toggleFavorite(userId, movieId);
    res.status(200).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFavoriteMovies = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await favoriteService.getFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  toggleFavorite,
  getFavoriteMovies,
};

// const User = require("../models/User");
// const crudService = require("../services/crud-service");

// // Get all Users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await crudService.readAll(User);
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Create a new User
// const createUser = async (req, res) => {
//   try {
//     const user = await crudService.create(User, req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get User by ID
// const getUserById = async (req, res) => {
//   try {
//     const user = await crudService.readById(User, req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update User by ID
// const updateUserById = async (req, res) => {
//   try {
//     const user = await crudService.updateById(User, req.params.id, req.body);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete User by ID
// const deleteUserById = async (req, res) => {
//   try {
//     const user = await crudService.deleteById(User, req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createUser,
//   getAllUsers,
//   getUserById,
//   updateUserById,
//   deleteUserById,
// };
