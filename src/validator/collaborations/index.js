const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const validateResult = CollaborationPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = CollaborationValidator;
