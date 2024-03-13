const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().max(50).required(),
  genre: Joi.string().max(50).required(),
  duration: Joi.number(),
  album_id: Joi.string(),
});

module.exports = { SongPayloadSchema };
