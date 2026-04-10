const validateEditProfileRequest = (data) => {
  const editedFields = [
    "firstName",
    "lastName",
    "email",
    "interests",
    "age",
    "bio",
    "profilePicture",
  ];
  const isValidFields = Object.keys(data).every((key) =>
    editedFields.includes(key),
  );

  if (!isValidFields) {
    return {
      isValid: false,
      message: `You can only edit ${editedFields.join(", ")}`,
    };
  }
  return { isValid: true };
};

module.exports = {
  validateEditProfileRequest,
};
