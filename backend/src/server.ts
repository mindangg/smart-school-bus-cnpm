import express from "express";
import type { Request, Response } from "express";


const app = express();
const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello TypeScript + Express 🚀");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
