import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function defaultMiddleware(next: NextMiddleware) {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next);

    return res;
  };
}
