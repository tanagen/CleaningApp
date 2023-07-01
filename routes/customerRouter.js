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
  updateCustomerInfo,
} = require("../controllers/customer");

// customer
router.get("/", renderCustomerRegisterPage);
router.post("/", checkPostedCustomerRegister, postCustomerRegister);
router.get("/list", getCustomerList);
router.post("/:id", delteCustomerInfo);
router.get("/edit/:id", renderCustomerEditPage);
router.post("/update/:id", checkUpdatedCustomerInfo, updateCustomerInfo);

module.exports = router;
