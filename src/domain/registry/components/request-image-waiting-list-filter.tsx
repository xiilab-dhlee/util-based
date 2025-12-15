"use client";

import { useAtom } from "jotai";

import { userWaitingRequestImageListSearchTextAtom } from "@/domain/registry/state/registry.atom";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function UserRequestImageWaitingListFilter() {
  const [searchText, setSearchText] = useAtom(
    userWaitingRequestImageListSearchTextAtom,
  );

  const { data } = useGetWaitingRequestImages({
    searchText,
  });

  return (
    <MySearchFilter
      title="이미지 사용 요청 승인 대기 목록"
      darkMode
      total={data?.totalSize}
    >
      <SearchInput
        darkMode
        placeholder="이미지, 이름, 태그를 검색"
        onSearch={setSearchText}
      />
    </MySearchFilter>
  );
}
