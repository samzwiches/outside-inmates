/// <reference types="@cloudflare/workers-types" />
import handler from "vinext/server/app-router-entry";

type ExecutionContext = import("@cloudflare/workers-types").ExecutionContext;

interface Env { ASSETS: KVNamespace; }

const worker = {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handler.fetch(request, env, ctx);
  },
};

export default worker;
