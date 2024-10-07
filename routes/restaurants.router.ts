import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
    const restaurants = await prisma.restaurant.findMany();

    res.json(restaurants);
});

export default router;
