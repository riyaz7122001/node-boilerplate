import { Router } from "express";
import { StartTransaction } from "../../middleware/common";
import authRouter from "./auth";
import { ValidateToken } from "../../middleware/admin/auth";
import protectedRouter from "./protected";

const router = Router();

router.use("/protected", ValidateToken("admin"), protectedRouter);
router.use("/auth", StartTransaction, authRouter);

export default router;
