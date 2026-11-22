import { Next } from "hono";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import User from "../model/user";
import { JWTPayload } from "hono/utils/jwt/types";

/**
 * validate jwt and attach user id
 */
export async function validateJwt(c: Context, next: Next) {
  try {
    // get the token from the auth header or cookies
    const cookieToken = getCookie(c, "auth_token");
    // get from header
    const authHeader = c.req.header("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer")
      ? authHeader.slice(7)
      : undefined;

    const token = cookieToken ?? bearerToken;

    if (!token) {
      return c.json(
        { message: "Unauthorized: No token provided", success: false },
        401,
      );
    }
    // verify the jwt https://hono.dev/docs/helpers/jwt#verify
    const jwtPayload = (await verify(
      token,
      process.env.JWT_SECRET ?? "STRONG SECRET",
      "HS256",
    )) as JWTPayload & { id: string; name: string };

    // get the user from teh db
    const user = await User.findById(jwtPayload.id);

    // if no user found
    if (!user) {
      return c.json({ message: "User not found", success: false }, 401);
    }

    // else set the user in context
    c.set("userId", jwtPayload.id);
    // go to next
    next();
  } catch {
    return c.json(
      { message: "Unauthorized: Invalid or expired token", success: false },
      401,
    );
  }
}
