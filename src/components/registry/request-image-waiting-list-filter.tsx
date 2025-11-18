"use client";

import { useAtomValue } from "jotai";

import { userWaitingRequestImageListSearchTextAtom } from "@/atoms/registry/registry.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { useSearch } from "@/hooks/common/use-search";
import { useGetWaitingRequestImages } from "@/hooks/request-image/use-get-waiting-request-images";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function UserRequestImageWaitingListFilter() {
  const { onSubmit } = useSearch(userWaitingRequestImageListSearchTextAtom);

  const searchText = useAtomValue(userWaitingRequestImageListSearchTextAtom);

  const { data } = useGetWaitingRequestImages({
    searchText,
  });

  return (
    <MySearchFilter
      title="이미지 사용 요청 승인 대기 목록"
      darkMode
      total={data?.totalSize}
    >
      <form onSubmit={onSubmit}>
        <SearchInput darkMode placeholder="이미지, 이름, 태그를 검색" />
      </form>
    </MySearchFilter>
  );
}
