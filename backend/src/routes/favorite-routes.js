const express = require("express");
const favoriteController = require("../controllers/favorite-controller");
const { toggleSchema } = require("../validation/favorite-validation");
const validateRequest = require("../middlewares/validate-request-service");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  validateRequest(toggleSchema),
  favoriteController.toggleFavorite
);

router.get("/:userId", authMiddleware, favoriteController.getFavoriteMovies);

module.exports = router;
