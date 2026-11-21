import { Context } from "hono";
import DiaryEntry from "../model/dairy-entry";

//get all the diary entries
export async function getAllDiaryEntries(c: Context) {
  try {
    // get all teh entries from the db
    const entries = await DiaryEntry.find().sort({
      createdAt: -1,
    });

    // send the response
    return c.json(
      {
        data: entries,
        success: true,
      },
      200,
    );
  } catch {
    return c.json(
      {
        message: "something went wrong",
        success: false,
      },
      500,
    );
  }
}
