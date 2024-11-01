import { Router, Request, Response } from "express";
import { prisma } from "../db.js";
import { log } from "console";

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

router.post("/", async (req: Request, res: Response): Promise<void> => {
    console.log(req);
    try {
        const { name, password, location, menu, tables, logo } = req.body;

        if (
            !name ||
            !password ||
            !location ||
            !logo ||
            !menu ||
            typeof tables !== "number" ||
            tables < 1
        ) {
            res.status(400).json({ error: "Invalid input data" });
            return;
        }

        const createdRestaurant = await prisma.restaurant.create({
            data: {
                name,
                password,
                location,
                logo,
                menu,
            },
        });

        const tableData = Array.from({ length: tables }, (_, index) => ({
            number: index + 1,
            restaurantId: createdRestaurant.id,
        }));

        await prisma.table.createMany({
            data: tableData,
        });

        res.status(201).json({
            message: "Restaurant and tables created successfully",
            restaurant: createdRestaurant,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/signin", async (req: Request, res: Response) => {
    console.log(req);
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            res.status(400).json({ error: "Invalid input data" });
            return;
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { name },
        });

        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }

        if (restaurant.password != password) {
            res.status(400).json({ error: "Wrong password" });
            return;
        }
        res.status(200).json({
            message: "Sign in correctly",
            restaurant: restaurant,
        });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
