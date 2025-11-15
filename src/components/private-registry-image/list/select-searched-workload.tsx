"use client";

import { format } from "date-fns";
import { type Dispatch, type SetStateAction, useState } from "react";
import styled from "styled-components";
import { Card, Input } from "xiilab-ui";

import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/components/common/card/compact-card-layer.styled";
import { useGetWorkloads } from "@/hooks/workload/use-get-workloads";

interface SelectSearchedWorkloadProps {
  checkedWorkloads: Set<string>;
  setCheckedWorkloads: Dispatch<SetStateAction<Set<string>>>;
}
/**
 * 검색된 워크로드 목록을 선택할 수 있는 컴포넌트
 * @param checkedWorkloads - 선택된 워크로드 목록
 * @param setCheckedWorkloads - 선택된 워크로드 목록을 설정하는 함수
 */
export function SelectSearchedWorkload({
  checkedWorkloads,
  setCheckedWorkloads,
}: SelectSearchedWorkloadProps) {
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data } = useGetWorkloads({
    searchText,
  });

  const handleCheckWorkload = (id: string) => {
    setCheckedWorkloads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  return (
    <Container>
      <Header>
        <Input.Search
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={(value) => handleSearch(value)}
          placeholder="워크로드 이름을 입력해 주세요."
          width="100%"
        />
      </Header>
      <Body>
        {data?.content?.map((workload) => (
          <Card
            key={workload.id}
            title={workload.workloadName}
            height={138}
            checked={checkedWorkloads.has(workload.id)}
            onCheckboxChange={() => handleCheckWorkload(workload.id)}
            showCheckBox
          >
            <CompactCardKeyValueRow>
              <CompactCardKey>타입:</CompactCardKey>
              <CompactCardValue>{workload.jobType}</CompactCardValue>
            </CompactCardKeyValueRow>
            <CompactCardKeyValueRow>
              <CompactCardKey>상태:</CompactCardKey>
              <CompactCardValue>{workload.status}</CompactCardValue>
            </CompactCardKeyValueRow>
            <CompactCardKeyValueRow>
              <CompactCardKey>생성일:</CompactCardKey>
              <CompactCardValue>
                {format(workload.creatorDate, "yyyy.MM.dd")}
              </CompactCardValue>
            </CompactCardKeyValueRow>
          </Card>
        ))}
      </Body>
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
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;
