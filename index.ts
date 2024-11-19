import express from "express";
import RestaurantRouter from "./routes/restaurants.router.js";
import OrderRouter from "./routes/orders.router.js";
import TableRouter from "./routes/tables.router.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
    cors({
        // TODO: Cambiar para que en PROD solo acepte el dominio de la app
        origin: [
            "http://localhost:4200",
            "https://verlacarta-front.vercel.app",
        ],
        credentials: true,
    }),
);

app.get("/", (_, res) => {
    res.send("VerLaCarta API running...");
});

app.use("/restaurants", RestaurantRouter);
app.use("/orders", OrderRouter);
app.use("/tables", TableRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
