"use client";

import { useSetAtom } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Button, Icon, Input, Table, Typography } from "xiilab-ui";

import type { Member } from "@/atoms/setting/setting-modal.atom";
import {
  openMemberAddModalAtom,
  openMemberDeleteModalAtom,
  openMemberDetailModalAtom,
} from "@/atoms/setting/setting-modal.atom";
import { MemberAddModal } from "@/components/setting/modal/member-add-modal";
import { MemberDeleteModal } from "@/components/setting/modal/member-delete-modal";
import { MemberDetailModal } from "@/components/setting/modal/member-detail-modal";
import { MemberEditModal } from "@/components/setting/modal/member-edit-modal";

/**
 * 멤버 관리 컴포넌트
 *
 * 워크스페이스 멤버들을 관리하는 컴포넌트입니다.
 * - 멤버 목록 테이블
 * - 멤버 추가/삭제
 * - 권한 관리
 * - 페이지네이션
 */
export function MemberManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // 멤버 추가 모달 열기 함수
  const openMemberAddModal = useSetAtom(openMemberAddModalAtom);

  // 멤버 삭제 모달 열기 함수
  const openMemberDeleteModal = useSetAtom(openMemberDeleteModalAtom);

  // 멤버 상세 모달 열기 함수
  const openMemberDetailModal = useSetAtom(openMemberDetailModalAtom);

  /**
   * 멤버 삭제 버튼 클릭 핸들러
   */
  const handleDeleteMember = (member: any) => {
    // Member 타입에 맞게 변환
    const memberToDelete: Member = {
      key: member.key,
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      joinDate: member.joinDate,
      group: member.group,
    };

    // 멤버 삭제 모달 열기
    openMemberDeleteModal(memberToDelete);
  };

  /**
   * 멤버 이름 클릭 핸들러 (상세 정보 보기)
   */
  const handleMemberNameClick = (member: any) => {
    // Member 타입에 맞게 변환
    const memberToView: Member = {
      key: member.key,
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      joinDate: member.joinDate,
      group: member.group,
    };

    // 멤버 상세 모달 열기
    openMemberDetailModal(memberToView);
  };

  // 임시 데이터
  const members = [
    {
      key: 1,
      id: 1,
      name: "이수빈",
      email: "sb.lee@astrago.com",
      role: "Owner",
      selected: false,
      status: "활성화",
      joinDate: "2025.01.15",
      group: "경영관리팀",
    },
    {
      key: 2,
      id: 2,
      name: "서경덕",
      email: "gd.seo@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 3,
      id: 3,
      name: "박금명",
      email: "gm.park@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 4,
      id: 4,
      name: "손지원",
      email: "jw.son@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 5,
      id: 5,
      name: "이재용",
      email: "jw.lee@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 6,
      id: 6,
      name: "방성은",
      email: "se.bang@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 7,
      id: 7,
      name: "김성은",
      email: "se.kim@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 8,
      id: 8,
      name: "최재용",
      email: "jy.choi@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 4,
      id: 4,
      name: "손지원",
      email: "jw.son@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 5,
      id: 5,
      name: "이재용",
      email: "jw.lee@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 6,
      id: 6,
      name: "방성은",
      email: "se.bang@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 7,
      id: 7,
      name: "김성은",
      email: "se.kim@astrago.com",
      role: "User",
      selected: false,
    },
    {
      key: 8,
      id: 8,
      name: "최재용",
      email: "jy.choi@astrago.com",
      role: "User",
      selected: false,
    },
  ];

  // 테이블 컬럼 정의
  const columns: ResponsiveColumnType<any>[] = [
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (name: string, record: any) => (
        <span
          onClick={() => handleMemberNameClick(record)}
          style={{ cursor: "pointer" }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "아이디",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "권한",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <RoleBadge role={role}>{role}</RoleBadge>,
    },
    {
      title: "삭제",
      key: "actions",
      width: "60px",
      render: (_: any, record: any) => (
        <DeleteButton
          disabled={record.role === "Owner"}
          onClick={() => handleDeleteMember(record)}
        >
          <Icon name="Delete" color="var(--icon-fill)" size={24} />
        </DeleteButton>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <Title>멤버관리</Title>
        <MemberCount>총 11명</MemberCount>
        <SearchInputWrapper>
          <Input.Search
            placeholder="이름 또는 이메일을 검색해 주세요."
            width={220}
            height={30}
          />
        </SearchInputWrapper>
        <Button
          color="primary"
          variant="gradient"
          width={100}
          height={30}
          icon="Plus"
          iconSize={18}
          iconPosition="left"
          style={{ fontSize: "13px", fontWeight: 500 }}
          onClick={openMemberAddModal}
        >
          멤버 추가
        </Button>
      </Header>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={members}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: members.length || 0,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size) setPageSize(size);
            },
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          size="small"
        />
      </TableContainer>

      {/* 멤버 추가 모달 */}
      <MemberAddModal />

      {/* 멤버 삭제 모달 */}
      <MemberDeleteModal />

      {/* 멤버 상세 모달 */}
      <MemberDetailModal />

      {/* 멤버 정보 수정 모달 */}
      <MemberEditModal />
    </Container>
  );
}

const Container = styled.div`
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 100%;
  height: 448px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 11px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px variant
  as: "h2",
})`
  color: #000000;
  margin: 0;
  margin-right: 6px;
`;

const MemberCount = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})`
  color: #000000;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  max-width: 220px;
  margin-left: auto;
  margin-right: 8px;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;

  .ant-table {
    border-radius: 4px;
    border: 1px solid #e1e4e7;
  }

  .ant-table-thead > tr > th {
    background: #f3f5f7;
    color: #000000;
    border-bottom: 1px solid #e1e4e7;
    padding: 0 !important;
  }

  .ant-table-tbody > tr > td {
    color: #000000;
    border-bottom: 1px solid #e1e4e7;
    padding: 0 !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8f9fa !important;
  }
`;

const RoleBadge = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "span",
})<{ role: string }>`
  color: ${({ role }) => (role === "Owner" ? "#000000" : "#000000")};
  text-align: center;
`;

const DeleteButton = styled.button`
  width: 26px;
  height: 26px;
  border: 1px solid #dcdcdc;
  border-radius: 2px;
  background: #fafafa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);

  &:disabled {
    background: #f3f3f3;
    border-color: #e8e8e8;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
