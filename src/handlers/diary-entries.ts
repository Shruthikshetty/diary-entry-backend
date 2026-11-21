import { Context } from "hono";
import DiaryEntry, { IDiaryEntry } from "../model/dairy-entry";

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

// handler to add a new diary entry
export async function addNewDiaryEntry(c: Context) {
  try {
    // get the request body
    const body = await c.req.json<IDiaryEntry>();

    // validate required filed
    if (!body.content || !body.title) {
      return c.json(
        {
          message: "content and title are required",
          success: false,
        },
        400,
      );
    }

    // add new entry
    const newDiaryEntry = new DiaryEntry(body);

    // add new diary entry
    await newDiaryEntry.save();

    // send the response
    return c.json(
      {
        data: newDiaryEntry,
        success: true,
      },
      201,
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
