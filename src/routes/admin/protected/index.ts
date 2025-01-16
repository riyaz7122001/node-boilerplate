import { Router } from "express";
import authRouter from './auth'
import managerRouter from './manager'

const router = Router();

router.use('/auth', authRouter);
router.use('/user', managerRouter)

export default router;