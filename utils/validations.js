import { body } from "express-validator";

const validateRegisteredUser = [
  body("name").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
    ),
  body("phone")
    .isMobilePhone()
    .withMessage("Please enter a valid phone number"),  
];

export { validateRegisteredUser  };