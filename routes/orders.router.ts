import { Router } from "express";
import { prisma } from "../db.js";
import { sendEmail } from "../utils/email.js";

const router = Router();

router.get("/restaurant/:restaurantId", async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const orders = await prisma.order.findMany({
            where: {
                restaurantId: restaurantId,
            },
            include: {
                table: true,
                restaurant: true,
            },
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching orders.",
        });
    }
});

router.get("/", async (_, res) => {
    const orders = await prisma.order.findMany({
        include: {
            table: true,
            restaurant: true,
        },
    });

    res.json(orders);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            table: true,
            restaurant: true,
        },
    });

    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }

    res.json(order);
});

router.put("/:orderId/status", async (req, res): Promise<void> => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status,
            },
        });
        let statusS = "entregado"
        if (updatedOrder.status == 1) {
            statusS = "aceptado"
        }else if (updatedOrder.status == 2) {
            statusS = "listo"
        }

        sendEmail(
            updatedOrder.email,
            "Tu pedido ahora está " + statusS + "!",
            "Pedido #" +
                updatedOrder.number +
                ", tu pedido está " +
                statusS,
        );
        res.status(200).json(updatedOrder);
        return;
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Error updating order status" });
        return;
    }
});

router.post("/", async (req, res) => {
    const { type, detail, tableId, email, restaurantId } = req.body;

    if (!type || !detail || !email || !restaurantId) {
        res.status(400).json({ error: "Some required parameters are missing" });
        return;
    }
    if (type !== "PickUp" && type !== "DineIn") {
        res.status(400).json({ error: "Wrong order type" });
        return;
    }
    if (type === "DineIn" && !tableId) {
        res.status(400).json({
            error: "Table ID is required for DineIn orders",
        });
        return;
    }

    try {
        let table;

        if (type === "DineIn") {
            table = {
                connect: {
                    id: tableId,
                },
            };
        }

        const orderData = {
            // number is autoincremented
            type,
            detail,
            // status is 0 by default
            email,
            table,
            restaurant: {
                connect: {
                    id: restaurantId,
                },
            },
        };

        const order = await prisma.order.create({
            data: orderData,
        });

        sendEmail(
            order.email,
            `Hiciste un pedido por VerLaCarta!`,
            `Pedido #${order.number}, tu pedido está pendiente de confirmación`,
        );

        res.json(order);
    } catch (error) {
        console.error("Error creating order: ", error);
        res.status(500).json({ error: "Error creating order" });
        return;
    }
});

export default router;
