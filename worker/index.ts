import handler from "vinext/server/app-router-entry";

interface Env { ASSETS: Fetcher; }

const worker = {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
