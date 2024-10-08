import express from "express";
import RestaurantRouter from "./routes/restaurants.router.js";
import OrderRouter from "./routes/orders.router.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (_, res) => {
    res.send("VerLaCarta API running...");
});

app.use("/restaurants", RestaurantRouter);
app.use("/orders", OrderRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
