"use client";

import { useSetAtom } from "jotai";

import { userWaitingRequestImageListSearchTextAtom } from "@/domain/registry/state/registry.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function UserRequestImageWaitingListFilter() {
  const setSearchText = useSetAtom(userWaitingRequestImageListSearchTextAtom);

  return (
    <MySearchFilter
      title="이미지 사용 요청 승인 대기 목록"
      darkMode
      showTotal={false}
    >
      <SearchInput
        darkMode
        placeholder="이미지, 이름, 태그를 검색"
        onSearch={setSearchText}
      />
    </MySearchFilter>
  );
}
