var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.get("/", (_, res) => {
    res.send("Hello World!");
});
app.get("/restaurants", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurants = yield prisma.restaurant.findMany();
    res.json(restaurants);
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
