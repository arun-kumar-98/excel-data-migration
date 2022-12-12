import DotenvConfigOptions from "dotenv";
DotenvConfigOptions.config();
import Express from "express";
const app = Express();
import { router } from "./src/router/router";

import BodyParser from "body-parser";

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

app.use("/", router);

//const port = 4000;
function run() {
  try {
    app.listen(process.env.port, () => {
      console.log(`server listening at port ${process.env.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
run();
