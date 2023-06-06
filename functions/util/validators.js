const isEmpty = (string) => {
  // Check if the string is empty or consists only of whitespace characters
  if (string.trim() === "") return true;
  else return false;
};

exports.validateLoginData = (data) => {
  let errors = {};

  // Validate the login data
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const isEmail = (email) => {
  const emailRegEx =
    // Regex to validate an email address format
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};
const isPhoneNumber = (phoneNumber) => {
  const phoneRegex = 
    // Regex to validate a phone number format
    /^(\+0?1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
  if (phoneNumber.match(phoneRegex)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  let errors = {};

  // Validate the sign-up data
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Must not be empty";
  } else if (!isPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = "Must be a valid phone number";
  }

  if (isEmpty(data.firstName)) errors.firstName = "Must not be empty";
  if (isEmpty(data.lastName)) errors.lastName = "Must not be empty";
  if (isEmpty(data.phoneNumber)) errors.phoneNumber = "Must not be empty";
  if (isEmpty(data.country)) errors.country = "Must not be empty";

  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password.length < 6) errors.password = "Must be at least 6 characters in length"
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must be the same";
  if (isEmpty(data.username)) errors.username = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
