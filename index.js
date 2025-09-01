const express = require("express");
const path = require("path");
const {connectToMongoDB} = require("./connect");
const cookieParser = require("cookie-parser");
const {restrictToLoggedinUserOnly,checkAuth} = require("./middlewares/auth");

const staticRoute = require("./routes/staticRoute");
const dashboardRoute = require("./routes/dashboard");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 10000;

connectToMongoDB(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);
app.use("/dashboard",restrictToLoggedinUserOnly,dashboardRoute);

app.listen(PORT, () => console.log(`Server Starter at ${PORT} !!`));
