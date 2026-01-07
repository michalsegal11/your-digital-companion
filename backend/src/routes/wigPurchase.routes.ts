import { Router } from "express";
import {
  getWigPurchases,
  getWigPurchase,
  createWigPurchase,
  updateWigPurchase,
  deleteWigPurchase
} from "../controllers/wigPurchase.controller";

const router = Router();

router.get("/", getWigPurchases);
router.get("/:id", getWigPurchase);
router.post("/", createWigPurchase);
router.put("/:id",updateWigPurchase);
router.delete("/:id",deleteWigPurchase);

export default router;
