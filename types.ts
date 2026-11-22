import { Context } from "hono";

export type AppVariables = {
  Variables: {
    userId: string;
  };
};

type AppContext = Context<AppVariables>;
