import express from "express";
import upload from "../utils/cloudinaryConfig.js";
import bannerController from "../controller/controllerBanner.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "FotoFondo", maxCount: 1 },
]);

router.get("/", bannerController.getAllBanners);
router.get("/:id", bannerController.getBannerById);
router.post("/", uploadFields, bannerController.insertBanner);
router.put("/:id", uploadFields, bannerController.updateBanner);
router.delete("/:id", bannerController.deleteBanner);

export default router;