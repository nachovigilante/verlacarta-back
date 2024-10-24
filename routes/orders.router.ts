import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/", async (_, res) => {
    res.send("Orders route");
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });
  
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
  
    res.json(order);
  });
  

export default router;
