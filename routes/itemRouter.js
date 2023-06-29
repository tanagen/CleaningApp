const router = express.Router();

// item関連
router.get("/add");
router.post("/add");
router.get("/finish-day-list");
router.post("/finish-day-delete/:id");
router.get("/add-edit/:id");
router.post("/add-update/:id");

export default router;
