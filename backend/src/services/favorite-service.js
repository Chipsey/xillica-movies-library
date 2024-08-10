const Favorite = require("../models/Favorite");
const crudService = require("./crud-service");

const toggleFavorite = async (userId, movieId) => {
  try {
    const existingFavorite = await Favorite.findOne({ userId, movieId });
    if (existingFavorite) {
      const addedMovie = addToFavorite(userId, movieId);
      return addedMovie;
    } else {
      const removedMovie = removeFromFavorite(userId, movieId);
      return removedMovie;
    }
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

const addToFavorite = async (userId, movieId) => {
  try {
    const favorite = await crudService.create(Favorite, { userId, movieId });
    return favorite;
  } catch (error) {
    throw new Error(`Error adding favorite movie: ${error.message}`);
  }
};

const removeFromFavorite = async (userId, movieId) => {
  try {
    const removed = await Favorite.findOneAndDelete({ userId, movieId });
    return removed;
  } catch (error) {
    throw new Error(`Error remove favorite movie: ${error.message}`);
  }
};

const getFavorites = async (userId) => {
  try {
    const favorites = await Favorite.find({ userId }).select("movieId");
    return favorites;
  } catch (error) {
    throw new Error(`Error fetching favorite movies: ${error.message}`);
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
};
