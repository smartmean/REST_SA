const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

//Route files
const programs = require("./routes/programs");
const auth = require("./routes/auth");
//const reservations = require("./routes/reservations");

//Connect to database
connectDB();

//Load env vars
dotenv.config({ path: "./config/config.env" });

//const app=express();
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [
      {
        url: "http://localhost:5100/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//Enable CORS
app.use(cors());

//Body parser
app.use(express.json());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 100, //10 mins
  max: 100,
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Cookie parser
app.use(cookieParser());

//Mount routers
app.use("/api/v1/programs", programs);
app.use("/api/v1/auth", auth);
// app.use("/api/v1/reservations", reservations);

//app.get('/', (req,res) => {
//1. res.send('<h1>'Hello from express</h1>');
//2. res.send({name:'Brad'});
//3. res.json({name:'Brad'});
//4. res.sendStatus(400);
//5. res.status(400).json({success:false});
//res.status(200).json({success:true, data:{id:1}});
//});
console.log("port", process.env.PORT);
const PORT = process.env.PORT || 5200;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, "mode on port ", PORT)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server % exit process
  server.close(() => process.exit(1));
});
