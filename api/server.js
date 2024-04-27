import express from "express";
import dotenv from 'dotenv'
import apiRouter from "./router.js";

const initializeExpressServer = async () => {
    dotenv.config();
    const port = process.env.PORT;

    const app = express();
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));

    app.use("/api/v1/ai-conversation", apiRouter);

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../frontend/build")));

        app.get("*", (req, res) =>
            res.sendFile(
                path.resolve(
                    __dirname,
                    "../",
                    "frontend",
                    "build",
                    "index.html"
                )
            )
        );
    } else {
        app.get("/", (req, res) => res.send("Please set to production"));
    }

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    return app;
};

const expressApp = initializeExpressServer();
export default expressApp;
