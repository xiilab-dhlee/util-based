"use client";

import { useSetAtom } from "jotai";
import { Input } from "xiilab-ui";

import { userWaitingRequestImageListSearchTextAtom } from "@/domain/registry/state/registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function UserRequestImageWaitingListFilter() {
  const setSearchText = useSetAtom(userWaitingRequestImageListSearchTextAtom);

  const handleSearch = (value: string) => {
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter
      title="이미지 사용 요청 승인 대기 목록"
      darkMode
      showTotal={false}
    >
      <Input.Search
        name="search"
        placeholder="이미지, 이름, 태그를 검색"
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        darkMode
      />
    </MySearchFilter>
  );
}
