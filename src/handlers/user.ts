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

// update user
export async function updateUser(c: Context) {
  try {
    // get the request body
    const body =
      await c.req.json<Partial<Pick<IUser, "name" | "password" | "email">>>();

    // get id from params
    const { id } = c.req.param();

    if (!body.name && !body.email && !body.password) {
      return c.json(
        {
          message: "at least one filed has to be updated",
          success: false,
        },
        400,
      );
    }

    // in case password ios updated hash it
    if (body.password) {
      body.password = await Bun.password.hash(body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(id, body);

    // validate if user found
    if (!updatedUser) {
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
        message: "user updated successfully",
        success: true,
        user: updatedUser,
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

// route to delete user
export async function deleteUser(c: Context) {
  try {
    // get id from params
    const { id } = c.req.param();

    const deletedUser = await User.findByIdAndDelete(id);

    // validate
    if (!deletedUser) {
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
        message: "user deleted successfully",
        success: true,
        user: deletedUser,
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
