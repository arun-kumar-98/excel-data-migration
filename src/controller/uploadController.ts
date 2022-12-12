import { Request, Response } from "express";
import Excel from "exceljs";
import pdfKit from "pdfkit";
import fs from "fs";

import { client } from "../../db";
import { font } from "pdfkit/js/mixins/fonts";
import { createUnparsedSourceFile } from "typescript";
const db = client.db("ts");
const records = db.collection("record");

const uplaoadController = async (req: Request, res: Response) => {
  // Step 1: Start a Client Session
  let session = client.startSession();

  // Step 2: Optional. Define options to use for the transaction
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    //begin transaction
    await session.withTransaction(async () => {
      let values: any = [];
      const data: any = [
        {
          name: String,
          age: Number,
        },
      ];
      let datas: {
        name: String;
        age: Number;
      };
      const file = req.file?.path;
      if (file) {
        const workBook = new Excel.Workbook();
        await workBook.xlsx.readFile(file);

        workBook.eachSheet((sheet) => {
          sheet.eachRow((rows) => {
            values = rows.values;

            // console.log(typeof values[1] == "string");
            if (
              typeof values[1] === "string" &&
              typeof values[2] === "number"
            ) {
              datas = {
                name: values[1],
                age: values[2],
              };

              data.push(datas);
            }
          });
        });
      }
      //res.send(resp);
      data.shift();

      //upload bulk of data

      const resp = records.insertMany(data, { session });
      res.status(200).send(resp);
      console.log("filter :  " + JSON.stringify(data));
      console.log(" file details:  " + file);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  } finally {
    session.endSession();
    client.close();
  }
};

const dowloadContller = async (req: Request, res: Response) => {
  // Step 1: Start a Client Session
  let session = client.startSession();

  // Step 2: Optional. Define options to use for the transaction
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
    await session.withTransaction(async () => {
      let countNoOfpeople = 0,
        sumOfAge = 0,
        aveargeAge = 0;

      const resp = await records.find().toArray();
      //
      console.log(resp);

      resp.forEach((record) => {
        sumOfAge += record.age;
        countNoOfpeople++;
      });
      aveargeAge = Math.floor(sumOfAge / countNoOfpeople);
      console.log(aveargeAge);

      // write reocrds in pdf

      //text font in pdf
      const BOLD_FONT = "Helvetica-Bold";

      let pdfDocs = new pdfKit();
      //create report

      pdfDocs.pipe(fs.createWriteStream("reportCard.pdf"));

      pdfDocs
        .font(BOLD_FONT, 25)
        .text(
          "TOTAL RECORDS IN DATABASE IS: " +
            countNoOfpeople +
            "\n Average of total age: " +
            aveargeAge
        );

      res.status(200).json({
        sum: sumOfAge,
        countNoOfpeople,
        message: "recort card generated successfully",
      });

      //close  pipe

      pdfDocs.end();
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "something went wrong !",
    });
  } finally {
    session.endSession();
    client.close();
  }
};
export { uplaoadController, dowloadContller };
