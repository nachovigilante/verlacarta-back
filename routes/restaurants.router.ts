import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
    const restaurants = await prisma.restaurant.findMany();

    res.json(restaurants);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
        where: {
            id,
        },
    });

    if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
    }

    res.json(restaurant);
});

export default router;
