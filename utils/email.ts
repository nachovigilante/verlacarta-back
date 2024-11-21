import nodemailer from "nodemailer";
import { SentMessageInfo } from "nodemailer";

const createTransport = () => {
    return nodemailer.createTransport({
        service: "gmail", // Usar el servicio de Gmail
        auth: {
            user: process.env.EMAIL_USER, // Correo electrónico del remitente
            pass: process.env.EMAIL_PASS, // Contraseña del remitente
        },
    });
};

export const sendEmail = (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Dirección del remitente
        to: to,
        subject: subject,
        text: text,
    };

    const transporter = createTransport();

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
