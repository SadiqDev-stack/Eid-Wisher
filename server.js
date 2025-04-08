// for ads 
const endpoint = "https://stenexeb.xyz/4/9162083";

const express = require("express");
const path = require("path");
const limiter = require("express-rate-limit");
let sucessCount = 0;
let errorCount = 0;
let response = [];
let total = 0;

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
    mine()
    console.log(`Server Started At http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.json({
        sucessCount,
        errorCount,
        total,
        response
    });
});

app.get("/wish/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "wish.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "home.html"));
});

app.get("/images/:image", (req, res) => {
    res.sendFile(path.join(__dirname, "static", "images", req.params.image));
})

app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

let delay = 5000; // in miliseconds
const mine = () => {
    fetch(endpoint)
        .then(res => res.json())
        .then(data => {
            response.push(data);
            successCount++;
            console.log("sent get to / ");
        })
        .catch(er => {
            response.push(er);
            errorCount++;
            console.log("error sending get to / ")
        })
        .finally(() => {
            total++;
            setTimeout(mine, delay)
        });
};

app.use(limit);

