import { Context } from "hono";
import DiaryEntry, { IDiaryEntry } from "../model/dairy-entry";
import { AppContext } from "../../types";

//get all the diary entries
export async function getAllDiaryEntries(c: AppContext) {
  try {
    // get user id from auth
    const userId = c.get("userId");
    // get all teh entries from the db
    const entries = await DiaryEntry.find({
      userId,
    }).sort({
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

export async function getSingleDiaryEntry(c: AppContext) {
  try {
    // get the params
    const { id } = c.req.param();
    // get user id from auth
    const userId = c.get("userId");

    // get the data from db
    const entry = await DiaryEntry.findById({ _id: id, userId });

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
export async function addNewDiaryEntry(c: AppContext) {
  try {
    // get the request body
    const body = await c.req.json<IDiaryEntry>();
    // get user id from auth
    const userId = c.get("userId");

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
    const newDiaryEntry = new DiaryEntry({ ...body, userId });

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
export async function deleteEntryId(c: AppContext) {
  try {
    // get the if from params
    const { id } = c.req.param();
    // get user id from auth
    const userId = c.get("userId");
    // delete the entry from db
    const deletedEntry = await DiaryEntry.findByIdAndDelete({
      _id: id,
      userId,
    });
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

// handler to update a entry
export async function updateEntryId(c: AppContext) {
  try {
    // get the req body
    const body = await c.req.json<Partial<IDiaryEntry>>();
    // get user id from auth
    const userId = c.get("userId");
    // validate required filed
    if (
      !body.content &&
      !body.title &&
      !body.date &&
      !body.mood &&
      (body.isFavorite == undefined || body.isFavorite == null)
    ) {
      return c.json(
        {
          message: "at least one field should be present",
          success: false,
        },
        400,
      );
    }
    // get if from param
    const { id } = c.req.param();
    // find and update
    const updatedEntry = await DiaryEntry.findByIdAndUpdate(
      {
        _id: id,
        userId,
      },
      body,
      {
        new: true,
      },
    );

    // in case update fail
    if (!updatedEntry) {
      return c.json(
        {
          message: "entry not found",
          success: false,
        },
        404,
      );
    }

    // if success return the updated entry
    return c.json(
      {
        data: updatedEntry,
        message: "updated successfully",
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
