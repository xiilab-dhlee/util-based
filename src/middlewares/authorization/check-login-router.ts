// middleware/withLogging.ts

import { Buffer } from "buffer";
import type { NextMiddleware } from "next/server";
import type { JWT } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

import { path as protectedPaths } from "@/middlewares/authorization/path-list";
import type { MiddlewareFactory } from "@/middlewares/types";

/**
 * 토큰을 파싱하여 권한을 추출합니다.
 * @param token
 * @returns
 */
const getRole = (token?: string): string[] => {
  if (!token) return [];
  const keylist = token.split(".");
  if (keylist.length <= 1) return [];
  const decodedJwtJsonData = Buffer.from(keylist[1], "base64").toString("utf8");
  const json = JSON.parse(decodedJwtJsonData);
  //console.debug('getRole =>', json);
  return json["realm_access"]["roles"];
};

/**
 * 로그인 여부 판단 미들웨어
 * @param next
 * @returns
 */
export const checkLoginRouter: MiddlewareFactory = () => {
  return withAuth({
    callbacks: {
      authorized: async ({ req, token }) => {
        const nextUrl = req.nextUrl;
        const { pathname } = nextUrl;
        if (!checkLogin(pathname, token)) {
          return false;
        }
        if (!checkRole(pathname, token)) {
          return false;
        }

        return true;
      },
    },
  }) as NextMiddleware;
};

const checkLogin = (pathname: string, token: JWT | null) => {
  const matchesProtectedPath = protectedPaths.some(({ path }) =>
    pathname.startsWith(path),
  );
  if (matchesProtectedPath) {
    if (token === null) {
      return false;
    }
  }
  return true;
};

const checkRole = (pathname: string, token: JWT | null) => {
  const role = getRole(token?.access_token);
  const pathinfo = protectedPaths.find(
    ({ path }) => pathname.indexOf(path) !== -1,
  );
  if (pathinfo === undefined) return true;
  if (pathinfo.path === "/register") return true;
  else {
    const access_role = pathinfo.roles;
    const intersection = access_role.filter((element) =>
      role.includes(element),
    );
    return intersection.length > 0;
  }
};
