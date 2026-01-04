import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.js";
import { PORT, HOSTNAME, API_URL } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middleware/errors.middleware.js";
import authorizeMiddleware from "./middleware/auth.middleware.js";

const app = express();

app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("tiny"));
app.use(cors());


app.use(`/${API_URL}`, authRouter);

// // app.options('/*', cors());

// app.get("/", (req, res) => {
  //   res.send("Hello World!!!!");
  // });
  
app.use(errorMiddleware);
app.use(authorizeMiddleware);
app.listen(PORT, HOSTNAME, async () => {
  console.log(`Server is running on port ${PORT} and hostname ${HOSTNAME}`);

  await connectToDatabase();
});
