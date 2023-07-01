const express = require("express");
const router = express.Router();
const { renderTop } = require("../controllers/top");

router.get("/", renderTop);

module.exports = router;
