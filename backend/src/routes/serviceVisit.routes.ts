import { Router } from "express";
import {
  getServiceVisits,
  getServiceVisitById,
  createServiceVisit,
  updateServiceVisit,
  deleteServiceVisit
} from "../controllers/serviceVisit.controller";

const router = Router();

router.get("/", getServiceVisits);
router.get("/:id", getServiceVisitById);
router.post("/", createServiceVisit);
router.put("/:id", updateServiceVisit);
router.delete("/:id", deleteServiceVisit);

export default router;
