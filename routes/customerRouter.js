const express = require("express");
const router = express.Router();
const {
  renderCustomerRegisterPage,
  checkPostedCustomerRegister,
  postCustomerRegister,
  getCustomerList,
  delteCustomerInfo,
  renderCustomerEditPage,
  checkUpdatedCustomerInfo,
  UpdateCustomerInfo,
} = require("../controllers/customer");

// customer関連
router.get("/", renderCustomerRegisterPage);
router.post("/", checkPostedCustomerRegister, postCustomerRegister);
router.get("/list", getCustomerList);
router.post("/:id", delteCustomerInfo);
router.get("/edit/:id", renderCustomerEditPage);
router.post("/update/:id", checkUpdatedCustomerInfo, UpdateCustomerInfo);

module.exports = router;
