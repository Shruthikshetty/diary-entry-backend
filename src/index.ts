import { Hono } from "hono";
import { ConnectDB } from "./utils/connect-db";
import {
  addNewDiaryEntry,
  deleteEntryId,
  getAllDiaryEntries,
  getSingleDiaryEntry,
  updateEntryId,
} from "./handlers/diary-entries";
import { addUser, deleteUser, getUser, updateUser } from "./handlers/user";

const app = new Hono();

// connect to db
app.use("/api/*", async (_, next) => {
  await ConnectDB();
  await next();
});

// base route
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// get all the diary entries
app.get("/api/diary", getAllDiaryEntries);
// get single diary
app.get("/api/diary/:id", getSingleDiaryEntry);
// add a new diary
app.post("/api/diary", addNewDiaryEntry);
// update a diary entry
app.put("/api/diary/:id", updateEntryId);
// delete a diary entry
app.delete("/api/diary/:id", deleteEntryId);

//get a user data
app.get("/api/user", getUser);
//add a user data
app.post("/api/user", addUser);
//update a user data
app.put("/api/user/:id", updateUser);
//delete a use data
app.delete("/api/user/:id", deleteUser);
export default app;
