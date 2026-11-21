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

export async function getSingleDiaryEntry(c: Context) {
  try {
    // get the params
    const { id } = c.req.param();

    // get the data from db
    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return c.json(
        {
          message: "entry not found",
          success: false,
        },
        404,
      );
    }

    // send the response
    return c.json(
      {
        data: entry,
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

// handler to delete a diary entry by id
export async function deleteEntryId(c: Context) {
  try {
    // get the if from params
    const { id } = c.req.param();
    // delete the entry from db
    const deletedEntry = await DiaryEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return c.json(
        {
          message: "entry not found",
          success: false,
        },
        404,
      );
    }

    // if deleted successfully
    return c.json(
      {
        data: deletedEntry,
        message: "deleted successfully",
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
