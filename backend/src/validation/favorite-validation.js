const Joi = require("joi");

const toggleSchema = Joi.object({
  userId: Joi.string().required(),
  movieId: Joi.string().required(),
});

module.exports = {
  toggleSchema,
};
