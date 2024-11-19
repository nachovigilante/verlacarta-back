import { Router, Request, Response } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const table = await prisma.table.findUnique({
        where: {
            id,
        },
    });

    if (!table) {
        res.status(404).json({ error: "Table not found" });
        return;
    }

    res.json(table);
});

export default router;