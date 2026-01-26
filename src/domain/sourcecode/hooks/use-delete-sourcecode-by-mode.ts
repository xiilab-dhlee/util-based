"use client";

import { useAdminDeleteSourceCodes } from "@/api/generated/admin-sourcecode/admin-sourcecode";
import { useDeleteSourceCodes } from "@/api/generated/source-code/source-code";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";

/** mode에 따라 user 또는 admin 소스코드 다중 삭제 mutation 반환 */
export const useDeleteSourcecodeByMode = (mode: SourcecodeMode) => {
  const userMutation = useDeleteSourceCodes();
  const adminMutation = useAdminDeleteSourceCodes();

  return mode === "user" ? userMutation : adminMutation;
};
