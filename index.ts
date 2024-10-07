import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.get("/", (_, res) => {
    res.send("Hello World!");
});

app.get("/restaurants", async (_, res) => {
    const restaurants = await prisma.restaurant.findMany();

    res.json(restaurants);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
