const router = express.Router();

// cleaning関連
router.get("/reception");
router.post("/reception");
router.get("/cleaning-list");
router.post("/cleaning-delete/:id");
router.get("/reception-edit/:id");
router.post("/reception-update/:id");

export default router;
