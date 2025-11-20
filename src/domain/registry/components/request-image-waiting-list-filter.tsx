"use client";

import { useAtomValue } from "jotai";

import { userWaitingRequestImageListSearchTextAtom } from "@/domain/registry/state/registry.atom";
import { useGetWaitingRequestImages } from "@/domain/request-image/hooks/use-get-waiting-request-images";
import { SearchInput } from "@/shared/components/input/search-input";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

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
