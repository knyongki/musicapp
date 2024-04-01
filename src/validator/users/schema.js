const Joi = require('joi');

const UserPayloadShema = Joi.object({
  username: Joi.string().max(50).required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayloadShema };
