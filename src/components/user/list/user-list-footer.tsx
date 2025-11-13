"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  userCheckedListAtom,
  userPageAtom,
  userSearchTextAtom,
} from "@/atoms/user/user-list.atom";
import { ListDeleteButton } from "@/components/common/buttons/list-delete-button";
import pubsubConstants from "@/constants/common/pubsub.constant";
import userListConstants from "@/constants/user/user-list.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetUsers } from "@/hooks/user/use-get-users";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 사용자 목록 페이지 하단 푸터 컴포넌트
 *
 * 사용자 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 사용자 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 사용자 목록 페이지 하단 푸터 컴포넌트
 */
export function UserListFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(userPageAtom);
  // 검색어
  const searchText = useAtomValue(userSearchTextAtom);
  // 체크된 사용자 목록
  const selectedUsers = useAtomValue(userCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetUsers({
    page,
    size: userListConstants.pageSize,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    // 삭제할 사용자가 없으면 에러 메시지 표시
    if (selectedUsers.size === 0) {
      toast.error("삭제할 사용자를 선택해 주세요.");
      return;
    }
    // 사용자 삭제 모달에 데이터 전달
    publish(pubsubConstants.user.sendDeleteUser, Array.from(selectedUsers));
  };

  return (
    <ListPageFooter
      total={data?.total || 0}
      page={page}
      pageSize={userListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}

