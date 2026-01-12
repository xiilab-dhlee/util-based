"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import styled from "styled-components";
import { Input } from "xiilab-ui";

import { WorkloadCard } from "@/domain/workload/components/workload-card";
import { useGetWorkloads } from "@/domain/workload/hooks/use-get-workloads";
import { ScrollShadowContainer } from "@/shared/components/layouts/scroll-shadow-container";

interface SelectSearchedWorkloadProps {
  checkedWorkload: string | null;
  setCheckedWorkload: Dispatch<SetStateAction<string | null>>;
}
/**
 * 검색된 워크로드 목록을 선택할 수 있는 컴포넌트
 * @param checkedWorkloads - 선택된 워크로드 목록
 * @param setCheckedWorkloads - 선택된 워크로드 목록을 설정하는 함수
 */
export function SelectSearchedWorkload({
  checkedWorkload,
  setCheckedWorkload,
}: SelectSearchedWorkloadProps) {
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data } = useGetWorkloads({
    searchText,
  });

  const handleCheckWorkload = (id: string) => {
    setCheckedWorkload(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <Container>
      <Header>
        <Input.Search
          value={searchKeyword}
          onChange={handleSearchKeywordChange}
          onSearch={handleSearch}
          placeholder="워크로드 이름을 입력해 주세요."
          width="100%"
        />
      </Header>
      <ScrollShadowContainer
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowHeight={20}
      >
        <Body>
          {data?.content?.map((workload) => (
            <WorkloadCard
              key={workload.id}
              {...workload}
              isChecked={checkedWorkload === workload.id}
              onCheck={() => handleCheckWorkload(workload.id)}
            />
          ))}
        </Body>
      </ScrollShadowContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background: white;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  height: 404px;
  margin-top: 4px;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 6px;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;
