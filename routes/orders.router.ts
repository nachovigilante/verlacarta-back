import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
    res.send("Orders route");
});

export default router;
