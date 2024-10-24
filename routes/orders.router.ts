import { Router } from "express";
import { prisma } from "../db.js";
import { SentMessageInfo } from 'nodemailer';
import { log } from "console";

const router = Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to: string, subject: string, text: string) => {
  const mailOptions = {
      from: process.env.EMAIL_USER, // Dirección del remitente
      to: to,
      subject: subject,
      text: text,
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
    if (error) {
          console.error("Error sending email:", error);
      } else {
          console.log("Email sent: " + info.response);
      }
  });
};

router.get("/", async (_, res) => {
    const orders = await prisma.order.findMany();

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
  
router.put('/:orderId/status', async (req, res):Promise<void> => {
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
  
        sendEmail("cindylevi@gmail.com", "Tu pedido ha cambiado de estado", "Tu pediiiido");
       res.status(200).json(updatedOrder);
       return;
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: 'Error updating order status' });
        return;
    }
  });
export default router;
