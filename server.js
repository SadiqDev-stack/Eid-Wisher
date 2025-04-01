const express = require("express");
const path = require("path");
const limiter = require("express-rate-limit");
const limit = limiter({
    windowMs: 60 * 1000,
    max: 300,
    handler: (req, res) => {
        res.json({
            message: "too many request try after some minute"
        });
    }
});

const app = express();

app.use(express.static("./static"));

const { PORT } = process.env;
app.listen(PORT, () => {
    console.log(`Server Started At http://localhost:${PORT}`);
});

app.get("/wish/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "wish.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "home.html"));
});
/*
app.get("/images/:image", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "images", req.params.image));
})*/

app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

app.use(limit);
