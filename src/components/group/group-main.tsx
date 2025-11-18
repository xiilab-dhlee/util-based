"use client";

import { useAtom } from "jotai";
import type { FormEvent } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import {
  groupTreeDataAtom,
  openCreateGroupModalAtom,
} from "@/atoms/group.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { CustomFileTree } from "@/components/common/tree/custom-file-tree";
import { DeleteGroupModal } from "@/components/group/delete-group-modal";
import { GroupButton } from "@/components/group/group-button";
import { GROUP_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetAllGroups } from "@/hooks/group/use-get-all-groups";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 그룹 관리 메인 컴포넌트
 *
 * 그룹 시스템을 관리하는 메인 컴포넌트로, 그룹 트리와 그룹 목록을
 * 좌우 분할 레이아웃으로 표시합니다. 그룹 추가, 삭제 등의
 * 기능을 제공합니다.
 *
 * @returns 그룹 관리 인터페이스
 */
export function GroupMain() {
  const publish = usePublish();
  // 그룹 트리 데이터 상태 관리
  const [treeData, setTreeData] = useAtom(groupTreeDataAtom);
  const { onOpen } = useGlobalModal(openCreateGroupModalAtom);

  // 그룹 목록 조회 훅
  const { data } = useGetAllGroups();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("searched");
  };

  const handleCreateGroup = () => {
    onOpen();
  };

  const handleDeleteGroup = () => {
    publish(GROUP_EVENTS.sendDeleteGroup, "test");
  };

  useEffect(() => {
    if (data?.content) {
      setTreeData(data.content);
    }
  }, [data?.content, setTreeData]);

  return (
    <>
      <Container>
        {/* 그룹 관리 헤더 영역 */}
        <DetailContentHeader>
          <DetailContentTitle>그룹 관리</DetailContentTitle>
          {/* 그룹 관리 도구 버튼들 */}
          <DetailContentTitleTool>
            <Button
              color="primary"
              icon="Plus"
              iconPosition="left"
              variant="gradient"
              width={100}
              height={30}
              onClick={handleCreateGroup}
            >
              그룹 추가
            </Button>
          </DetailContentTitleTool>
        </DetailContentHeader>

        {/* 그룹 내용 - 좌우 분할 레이아웃 */}
        <FileContent>
          {/* 왼쪽: 그룹 트리 영역 */}
          <Left>
            <FileContentHeader>
              <FileTitle>그룹 목록</FileTitle>
            </FileContentHeader>
            <SearchForm onSubmit={handleSubmit}>
              <SearchInput
                width="100%"
                placeholder="그룹 이름을 검색해 주세요."
              />
            </SearchForm>

            {/* 커스텀 파일 트리 컴포넌트 */}
            <CustomFileTree
              treeData={treeData}
              fileButton={GroupButton}
              isActiveRootNode
            />
          </Left>

          {/* 오른쪽: 그룹 상세 정보 및 목록 영역 */}
          <Right>
            <FileContentHeader>
              {/* 선택된 노드에 따른 제목 표시 */}
              <FileTitle>계정 정보</FileTitle>
            </FileContentHeader>
            <FileContentBody>
              <Article>
                <ArticleTitle>기본 정보</ArticleTitle>
                <ArticleBody>
                  <ArticlePane>
                    <ArticleRecord>
                      <ArticleKey>아이디</ArticleKey>
                      <ArticleValue>dj.jeong@xiilab.com</ArticleValue>
                    </ArticleRecord>
                    <ArticleRecord>
                      <ArticleKey>이름</ArticleKey>
                      <ArticleValue>홍길동</ArticleValue>
                    </ArticleRecord>
                    <ArticleRecord>
                      <ArticleKey>상세</ArticleKey>
                      <ArticleValue>활성화</ArticleValue>
                    </ArticleRecord>
                  </ArticlePane>
                  <ArticlePane>
                    <ArticleRecord>
                      <ArticleKey>권한</ArticleKey>
                      <ArticleValue>User</ArticleValue>
                    </ArticleRecord>
                    <ArticleRecord>
                      <ArticleKey>가입일</ArticleKey>
                      <ArticleValue>2025.01.01</ArticleValue>
                    </ArticleRecord>
                    <ArticleRecord>
                      <ArticleKey>가입 경로</ArticleKey>
                      <ArticleValue>AstraGo</ArticleValue>
                    </ArticleRecord>
                  </ArticlePane>
                </ArticleBody>
              </Article>
              <Article>
                <ArticleTitle>워크스페이스</ArticleTitle>
                <ArticleBody>
                  <ArticlePane>
                    <ArticleRecord>
                      <ArticleKey>보유 개수</ArticleKey>
                      <ArticleValue>2개</ArticleValue>
                    </ArticleRecord>
                    <ArticleRecord>
                      <ArticleKey>생성 제한 개수</ArticleKey>
                      <ArticleValue>4개</ArticleValue>
                    </ArticleRecord>
                  </ArticlePane>
                </ArticleBody>
                <ArticleBody>
                  <ArticlePane>
                    <ArticleTitle>그룹</ArticleTitle>
                    <ArticleRecord>
                      <ArticleKey>그룹 목록</ArticleKey>
                      <ArticleValue>
                        <Group>서비스 개발</Group>
                        <Group>AI 모델연구_모델1팀</Group>
                        <Group>경영관리팀</Group>
                      </ArticleValue>
                    </ArticleRecord>
                  </ArticlePane>
                </ArticleBody>
              </Article>
            </FileContentBody>
            <FileContentFooter>
              <Button
                variant="outlined"
                width={80}
                height={34}
                onClick={handleDeleteGroup}
              >
                삭제
              </Button>
            </FileContentFooter>
          </Right>
        </FileContent>
      </Container>
      {/* 그룹 삭제 모달 */}
      <DeleteGroupModal />
    </>
  );
}

const Container = styled.div`
  padding: 24px 28px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const FileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;

const Left = styled.div`
  width: 334px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Right = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const FileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const FileContentBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const FileContentFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
`;

const FileTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const SearchForm = styled.form`
  margin-bottom: 16px;
`;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  padding: 20px 22px;
  background-color: #fcfcfc;
  border-radius: 4px;

  & + & {
    margin-top: 10px;
  }
`;

const ArticleTitle = styled(FileTitle)`
  margin-bottom: 16px;
`;

const ArticleBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & + & {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    margin-top: 20px;
  }
`;

const ArticlePane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  & + & {
    border-left: 1px solid #e0e0e0;
    padding-left: 24px;
  }
`;

const ArticleRecord = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & + & {
    margin-top: 10px;
  }
`;

const ArticleKey = styled.div`
  width: 85px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  line-height: 100%;
  color: #484848;
`;

const ArticleValue = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const Group = styled.div`
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  padding: 0 8px;
  color: #171b26;

  & + & {
    margin-left: 8px;
  }
`;
