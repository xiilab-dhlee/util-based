import styled from "styled-components";
import { Button } from "xiilab-ui";

import type {
  GroupMemberResponse,
  GroupSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ITEM_TYPES,
  type ItemType,
} from "@/shared/components/group-member-selector/types";

interface SelectedMemberListProps {
  /** 선택된 계정 목록 */
  selectedAccounts: GroupMemberResponse[];
  /** 선택된 그룹 목록 */
  selectedGroups: GroupSummaryResponse[];
  /** 멤버 제거 */
  onRemoveMember: (id: string, type: ItemType) => void;
}

/**
 * 선택된 멤버 목록
 */
export function SelectedMemberList({
  selectedAccounts,
  selectedGroups,
  onRemoveMember,
}: SelectedMemberListProps) {
  return (
    <Container>
      {/* 선택된 계정 섹션 */}
      <Section>
        <SectionHeaderRow>
          <SectionTitle>선택된 계정</SectionTitle>
          <SectionSummary>총 {selectedAccounts.length}명</SectionSummary>
        </SectionHeaderRow>
        <SelectedBox>
          {selectedAccounts.length === 0 ? (
            <EmptyText>선택된 계정이 없습니다.</EmptyText>
          ) : (
            <SelectedList>
              {selectedAccounts.map((account) => (
                <SelectedItem key={account.accountId}>
                  <SelectedItemContent>
                    <SelectedItemName>{account.accountName}</SelectedItemName>
                    {account.email && (
                      <SelectedItemSubName>{account.email}</SelectedItemSubName>
                    )}
                  </SelectedItemContent>
                  <Button
                    icon="Delete"
                    onClick={() =>
                      onRemoveMember(account.accountId, ITEM_TYPES.ACCOUNT)
                    }
                  />
                </SelectedItem>
              ))}
            </SelectedList>
          )}
        </SelectedBox>
      </Section>

      {/* 선택된 그룹 섹션 */}
      <Section>
        <SectionHeaderRow>
          <SectionTitle>선택된 그룹</SectionTitle>
          <SectionSummary>총 {selectedGroups.length}그룹</SectionSummary>
        </SectionHeaderRow>
        <SelectedBox>
          {selectedGroups.length === 0 ? (
            <EmptyText>선택된 그룹이 없습니다.</EmptyText>
          ) : (
            <SelectedList>
              {selectedGroups.map((group) => (
                <SelectedItem key={group.groupId}>
                  <SelectedItemContent>
                    <SelectedItemName>{group.groupName}</SelectedItemName>
                    <SelectedItemSubName>5명</SelectedItemSubName>
                  </SelectedItemContent>
                  <Button
                    icon="Delete"
                    onClick={() =>
                      onRemoveMember(group.groupId, ITEM_TYPES.GROUP)
                    }
                  />
                </SelectedItem>
              ))}
            </SelectedList>
          )}
        </SelectedBox>
      </Section>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 6px;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: #000;
`;

const SectionSummary = styled.div`
  font-size: 11px;
  color: #000;
`;

const SelectedBox = styled.div`
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  height: 136px;
  padding: 8px 12px;
  overflow-y: auto;
  background-color: #fff;
`;

const EmptyText = styled.div`
  font-size: 12px;
  color: #828588;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 4px 4px;
  border-bottom: 1px solid #f1f1f1;
`;

const SelectedItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  margin-right: 4px;
`;

const SelectedItemName = styled.span`
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
`;

const SelectedItemSubName = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
