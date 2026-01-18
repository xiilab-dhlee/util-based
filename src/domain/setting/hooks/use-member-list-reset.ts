import { useResetAtom } from "jotai/utils";

import {
  settingMemberPageAtom,
  settingMemberSearchTextAtom,
} from "@/domain/setting/state/setting.atom";

export interface MemberListResetFunctions {
  resetForSearch: () => void;
  resetForPageChange: () => void;
  resetAll: () => void;
}

export function useMemberListReset(): MemberListResetFunctions {
  const resetPageAtom = useResetAtom(settingMemberPageAtom);
  const resetSearchTextAtom = useResetAtom(settingMemberSearchTextAtom);

  return {
    resetForSearch: () => {
      resetPageAtom();
    },

    resetForPageChange: () => {
      resetPageAtom();
    },

    resetAll: () => {
      resetPageAtom();
      resetSearchTextAtom();
    },
  };
}
