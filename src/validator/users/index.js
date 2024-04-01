const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadShema } = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadShema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
