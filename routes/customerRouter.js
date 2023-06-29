const express = require("express");
const router = express.Router();
const {
  getCustomerRegister,
  postCustomerRegister,
} = require("../controllers/customer");

// customer関連
router.get("/register", getCustomerRegister);
// router.post("/register", postCustomerRegister);
// router.get("/customer-list");
// router.post("/customer-delete/:id");
// router.get("/register-edit/:id");
// router.post("/register-update/:id");

module.exports = router;
