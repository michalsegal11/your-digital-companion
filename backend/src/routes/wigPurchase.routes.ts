import { Router } from "express";
import {
  getWigPurchases,
  getWigPurchase,
  createWigPurchase
} from "../controllers/wigPurchase.controller";

const router = Router();

router.get("/", getWigPurchases);
router.get("/:id", getWigPurchase);
router.post("/", createWigPurchase);

export default router;
