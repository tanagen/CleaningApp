const express = require("express");
const router = express.Router();
const {
  renderCleaningReceptionPage,
  checkPostedCleaningReception,
  postCleaningReception,
  getCleaningList,
  deleteCleaningInfo,
  renderCleaningEditPage,
  checkUpdatedCleaningInfo,
  updateCleaingInfo,
} = require("../controllers/cleaning");

// cleaning
router.get("/", renderCleaningReceptionPage);
router.post("/", checkPostedCleaningReception, postCleaningReception);
router.get("/list", getCleaningList);
router.post("/:id", deleteCleaningInfo);
router.get("/edit/:id", renderCleaningEditPage);
router.post("/update/:id", checkUpdatedCleaningInfo, updateCleaingInfo);

module.exports = router;
