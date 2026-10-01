const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/userRoutes");

const app = express();


// ========================
// MIDDLEWARE
// ========================

app.use(express.json());

app.use(cookieParser());


// ========================
// CORS
// ========================

app.use(cors({
    origin: "http://localhost:8080",
    credentials: true
}));


// ========================
// ROUTES
// ========================

app.use("/", authRoutes);


// ========================
// SERVER
// ========================

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});