// This Function validate phone number
export const validatePhoneNumber = (phone) => {
  const validPhoneNumRegEx = /^(?:\+91[-\s]?)?[0]?(91)?[789]\d{9}$/;

  return validPhoneNumRegEx.test(phone);
};

// This Function validate email address
export const validateEmailAddress = (email) => {
  const validEmailRegEx =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  return validEmailRegEx.test(email);
};

// This Function validate strong password
export const validateStrongPassword = (password) => {
  const strongPasswordRegEx =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,(>),?,\,/])(?=.*[a-zA-Z]).{8,}$/g;

  return strongPasswordRegEx.test(password);
};

// This Function validate pan number
export const validatePANNumber = (panNumber) => {
  const panNumberRegEx = /[A-Za-z]{5}\d{4}[A-Za-z]{1}/g;

  return panNumberRegEx.test(panNumber);
};
