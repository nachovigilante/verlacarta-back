import express from "express";
import RestaurantRouter from "./routes/restaurants.router.js";
import OrderRouter from "./routes/orders.router.js";
const app = express();
app.get("/", (_, res) => {
    res.send("VerLaCarta API running...");
});
app.use("/restaurants", RestaurantRouter);
app.use("/orders", OrderRouter);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
