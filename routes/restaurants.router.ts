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
    const {
      name,
      location,
      menu,
      tables,
      logo,
    } = req.body;


    if (!name || !location || !logo || !menu || typeof tables !== 'number' || tables < 1) {
       res.status(400).json({  error: "Invalid input data" });
       return;
    }

    const createdRestaurant = await prisma.restaurant.create({
      data: {
        name,
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

    res.status(201).json({ message: "Restaurant and tables created successfully", restaurant: createdRestaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
