import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (_, res) => {
    res.send("Orders route");
});

export default router;
