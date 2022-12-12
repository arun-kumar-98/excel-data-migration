import multer from "multer";
import { Request } from "express";
import Path from "fs";
import MimeTypes from "mime-type";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./src/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + file.originalname);
  },
});

// file.mimetypes.includes("excel") ||
//     file.mimetype.includes("spreadsheetml")

const filter = function (req: Request, file: any, callback: any) {
  if (
    file.mimetype == "application/vnd.ms-excel" ||
    file.mimetype ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    callback(null, true);
  } else {
    callback(
      new Error("file extension mismatched !\n please upload file carefully"),
      false
    );
  }
};

// MULTER INITIALIZATION

const upload = multer({
  storage: storage,
  fileFilter: filter,
}).single("file");

export { upload };
