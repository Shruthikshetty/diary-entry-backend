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
import { validateJwt } from "./middleware/validate-jwt";
import { authenticate, forgotPassword, logOut } from "./handlers/auth";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono();

const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = new Set([
  "http://127.0.0.1:3001",
  "http://localhost:3001",
  ...(frontendUrl ? [new URL(frontendUrl).origin] : []),
]);

//CORS means Cross-Origin Resource Sharing.
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (allowedOrigins.has(origin)) return origin;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// connect to db
app.use("/api/*", async (_, next) => {
  await ConnectDB();
  await next();
});

// set up cors

// base route
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// logging
app.use(logger());

//https://hono.dev/docs/guides/middleware#routing
// attach auth middler
app.use("/api/diary/*", validateJwt);
app.use("/api/user/*", validateJwt);

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

//sign up
app.post("/api/signup", addUser);
// login
app.post("/api/login", authenticate);
// log out
app.post("/api/logout", logOut);
// forgot password
app.post("/api/forgot-password", forgotPassword);

//get a user data
app.get("/api/user", getUser);
//update a user data
app.put("/api/user", updateUser);
//delete a use data
app.delete("/api/user", deleteUser);

export default app;
