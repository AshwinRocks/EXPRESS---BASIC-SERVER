const express = require("express");
const applicationRouter = require("./routes/applications.routes");

const app = express();

// app.use(express.json());

app.use((req, res, next) => {
    console.log(`Method: ${req.method} URL: ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome to express server");
});

app.use('/applications', applicationRouter);

app.use((req, res) => {
    res.status(404).json({
        status: "failed",
        msg: "no page found"
    })
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        status: "failed",
        error: "Internsl server error"
    })
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));