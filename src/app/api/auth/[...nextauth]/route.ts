import NextAuth from "next-auth";

import { authOptions } from "@/shared/config/auth.config";

/**
 * NextAuth API Route Handler
 *
 * 설정은 src/shared/config/auth.config.ts에서 관리됩니다.
 * getServerSession(authOptions)로 서버 컴포넌트에서 세션을 가져올 수 있습니다.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
