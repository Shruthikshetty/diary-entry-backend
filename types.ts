import { Context } from "hono";

export type AppVariables = {
  Variables: {
    userId: string;
  };
};

export type AppContext = Context<AppVariables>;
