require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const app = express();

// Routes
const dataRoutes = require("./routes/data");

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use("/api", dataRoutes);

// PORT
const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => console.log(`Server running at ${port}!`));
