import { Context } from "hono";
import User, { IUser } from "../model/user";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

// route to authenticate user and return the jwt
export async function authenticate(c: Context) {
  try {
    // get the name and pass from the body
    const body = await c.req.json<Pick<IUser, "password" | "name">>();

    // validation
    if (!body.name || !body.password) {
      return c.json(
        {
          message: "both name and password are required",
          success: false,
        },
        400,
      );
    }

    // validate from the database
    const user = await User.findOne({
      name: body.name,
    });
    // in case no user found
    if (!user) {
      return c.json(
        {
          message: "user not found",
          success: false,
        },
        404,
      );
    }
    // verify password
    const isPasswordValid = await Bun.password.verify(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      return c.json(
        {
          message: "invalid password",
          success: false,
        },
        401,
      );
    }

    // generate jwt
    const jwtPayload = {
      id: user._id.toString(),
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // in seconds  (1 day)
    };

    // SIGN THE TOKEN
    const token = await sign(
      jwtPayload,
      process.env.JWT_SECRET ?? "STRONG SECRET",
    );

    // set cookies for web app
    setCookie(c, "auth_token", token, {
      // key name
      httpOnly: true, // http only cookie hides from direct clint side js
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 24, // in seconds  (1 day)
    });

    return c.json(
      {
        message: "user authenticated successfully",
        success: true,
        token,
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
