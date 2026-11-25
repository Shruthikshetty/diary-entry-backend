import { Context, Hono } from "hono";
import User, { IUser } from "../model/user";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Resend } from "resend";

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
      "HS256", // algo
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

// forgot password
export async function forgotPassword(c: Context) {
  try {
    // get the name form the params
    const { name } = c.req.param();
    // get the user from name
    const user = await User.findOne({
      name: name,
    });

    if (!user || !user.email) {
      return c.json(
        {
          success: false,
          message: "user are not eligible for this action",
        },
        400,
      );
    }

    // else generate a special reset link
    const resetToken = await sign(
      {
        id: user._id.toString(),
        name: user.name,
        purpose: "password-reset",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 1, // 1 hour
      },
      process.env.JWT_SECRET ?? "STRONG SECRET",
      "HS256",
    );

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3001";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const resend = new Resend(process.env.RESENT_KEY);

    const { error } = await resend.emails.send({
      from: `StillDiary <${process.env.RESENT_SENDER}>`, // for testing
      to: user.email,
      subject: "Reset your password",
      html: `<p>Hi ${user.name},</p><p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });

    // in case of email send fail
    if (error) {
      return c.json(
        {
          message: "failed to send reset email",
          success: false,
        },
        500,
      );
    }

    // in case of success
    return c.json(
      {
        message: "password reset email sent",
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
