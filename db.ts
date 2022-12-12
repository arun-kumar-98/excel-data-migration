import { MongoClient } from "mongodb";

const URI = "mongodb://127.0.0.1:27017";
const client = new MongoClient(URI);
client.connect();

// const db = client.db("ts");

export { client };
