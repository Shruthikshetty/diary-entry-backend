import { Context } from "hono";
import User from "../model/user";

// handler to get a user data by id
export async function getUser(c: Context) {
  try {
    // get a id from params
    const { id } = c.req.param();

    const user = await User.findById(id);

    // validate if user found
    if (!user) {
      return c.json(
        {
          message: "user not found",
          success: false,
        },
        404,
      );
    }

    // else send success with user
    return c.json(
      {
        message: "user fetched successfully",
        success: true,
        user,
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
