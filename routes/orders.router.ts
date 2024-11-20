import { Router } from "express";
import { prisma } from "../db.js";
import { SentMessageInfo } from "nodemailer";
import { log } from "console";
import nodemailer from "nodemailer";

const router = Router();

const transporter = nodemailer.createTransport({
    service: "gmail", // Usar el servicio de Gmail
    auth: {
        user: process.env.EMAIL_USER, // Correo electrónico del remitente
        pass: process.env.EMAIL_PASS, // Contraseña del remitente
    },
});

const sendEmail = (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Dirección del remitente
        to: to,
        subject: subject,
        text: text,
    };

    transporter.sendMail(
        mailOptions,
        (error: Error | null, info: SentMessageInfo) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Email sent: " + info.response);
            }
        },
    );
};

router.get("/restaurant/:restaurantId", async (req, res) => {
    const { restaurantId } = req.params;
    try {
        const orders = await prisma.order.findMany({
            where: {
                table: {
                    restaurantId: restaurantId,
                },
            },
            include: {
                table: {
                    include: {
                        restaurant: true,
                    },
                },
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
            table: {
                include: {
                    restaurant: true,
                },
            },
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

        sendEmail(
            updatedOrder.email,
            "Tu pedido ahora esta " + updatedOrder.status + "!",
            "Mesa #" +
                updatedOrder.number +
                ", tu pedido esta " +
                updatedOrder.status,
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
    const { type, detail, tableId, email } = req.body;

    if (!type || !detail || !tableId || !email) {
        res.status(400).json({ error: "Some required parameters are missing" });
        return;
    }
    if (type !== "PickUp" && type !== "DineIn") {
        res.status(400).json({ error: "Wrong order type" });
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
        };

        const order = await prisma.order.create({
            data: orderData,
        });

        sendEmail(
            order.email,
            // TODO: agregar el nombre del restaurant
            `Hiciste un pedido en {nombre del restaurant} por VerLaCarta!`,
            `${order.type === "DineIn" ? `Mesa #${order.number}` : "Pedido para retirar"}, tu pedido está pendiente de confirmación`,
        );

        res.json(order);
    } catch (error) {
        console.error("Error creating order: ", error);
        res.status(500).json({ error: "Error creating order" });
        return;
    }
});

export default router;
