const express = require("express");
const router = express.Router();
const {
  renderItemAddPage,
  checkPostedItemAdd,
  postItemAdd,
  getItemList,
  deleteItemInfo,
  renderItemEditPage,
  checkUpdatedItemInfo,
  updateItemInfo,
} = require("../controllers/item");

// item関連
router.get("/", renderItemAddPage);
router.post("/", checkPostedItemAdd, postItemAdd);
router.get("/list", getItemList);
router.post("/:id", deleteItemInfo);
router.get("/edit/:id", renderItemEditPage);
router.post("/update/:id", checkUpdatedItemInfo, updateItemInfo);

module.exports = router;
