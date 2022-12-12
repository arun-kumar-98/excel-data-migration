import Express from "express";
import * as controller from "../controller/uploadController";

import { upload } from "../middleware/uplaoad";
const router = Express();

router.post("/file", upload, controller.uplaoadController);
router.get("/download", controller.dowloadContller);

export { router };
