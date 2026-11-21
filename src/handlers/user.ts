import { Context } from "hono";
import User, { IUser } from "../model/user";

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

// handler to add a user
export async function addUser(c: Context) {
  try {
    // get the body
    const body = await c.req.json<IUser>();

    // validate
    if (!body.name || !body.password) {
      return c.json(
        {
          message: "Please fill the required fields",
          success: false,
        },
        400,
      );
    }
    //https://bun.sh/docs/runtime/hashing#bun-password
    // hash password
    const hash = await Bun.password.hash(body.password); // default algo argon2id

    // create new user
    const newUser = new User({
      name: body.name,
      password: hash,
    });

    // save the user
    await newUser.save();

    // remove password from response
    const { password, ...rest } = newUser.toObject();

    // send response
    return c.json(
      {
        message: "User created successfully",
        success: true,
        user: rest,
      },
      201,
    );

    // create user
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
