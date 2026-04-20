import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import asistenteRouter from "./asistente.js";
import waitlistRouter from "./waitlist.js";
import insightsRouter from "./insights.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(asistenteRouter);
router.use(waitlistRouter);
router.use(insightsRouter);

export default router;
