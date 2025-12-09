"use client";

import styled from "styled-components";
import {
  Button,
  CompoundDropdown,
  Icon,
  InputNumber,
  Tag,
  Typography,
} from "xiilab-ui";

import type { MigResourceType } from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { useMigForm } from "@/shared/hooks/use-mig-form";

// ===== 타입 =====

/** MIG 프로필 옵션 타입 */
interface MigProfileOption {
  profile: string;
  availableCount: number;
}

// ===== 상수 =====

/** MIG 프로필 옵션 (하드코딩 - 각 프로필별 사용 가능한 개수 포함) */
const MIG_PROFILE_OPTIONS: MigProfileOption[] = [
  { profile: "1g.5gb", availableCount: 10 },
  { profile: "1g.10gb", availableCount: 8 },
  { profile: "1g.12gb", availableCount: 7 },
  { profile: "2g.12gb", availableCount: 6 },
  { profile: "2g.20gb", availableCount: 5 },
  { profile: "3g.20gb", availableCount: 4 },
  { profile: "3g.40gb", availableCount: 3 },
  { profile: "4g.20gb", availableCount: 2 },
  { profile: "4g.40gb", availableCount: 2 },
  { profile: "7g.40gb", availableCount: 1 },
  { profile: "7g.80gb", availableCount: 1 },
];

// ===== 헬퍼 함수 =====

/**
 * MIG 옵션을 렌더링하는 헬퍼 함수
 * @param profile - MIG 프로필 (예: "1g.12gb")
 * @param availableCount - 사용 가능한 개수
 */
const renderMigOption = (profile: string, availableCount: number) => {
  return (
    <MigOptionContainer>
      <Typography.Text variant="body-2-4" color="#000000" data-interactive-text>
        {profile}
      </Typography.Text>
      <Tag variant="gray"> {availableCount}개</Tag>
    </MigOptionContainer>
  );
};

// ===== 타입 =====

export interface MigFormFieldProps {
  /** MIG 리소스 목록 (controlled) */
  value: MigResourceType[];

  /** 전체 필드 에러 (예: 중복 프로필) */
  error?: string;

  /** 추가 콜백 */
  onAdd: (resource: MigResourceType) => void;

  /** 수정 콜백 */
  onUpdate: (index: number, resource: MigResourceType) => void;

  /** 삭제 콜백 */
  onRemove: (index: number) => void;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 클래스명 */
  className?: string;
}

// ===== 컴포넌트 =====

/**
 * MIG 폼 필드
 *
 * MIG 리소스를 추가/수정/삭제할 수 있는 재사용 가능한 폼 컴포넌트입니다.
 */
export function MigFormField({
  value,
  error,
  onAdd,
  onUpdate,
  onRemove,
  disabled = false,
  className,
}: MigFormFieldProps) {
  const {
    tempProfile,
    tempCount,
    inputError,
    setTempProfile,
    setTempCount,
    validateAndGetResource,
    resetForm,
  } = useMigForm();

  /**
   * 선택된 프로필의 사용 가능한 개수 가져오기
   */
  const getAvailableCount = (
    profile: string | undefined,
  ): number | undefined => {
    if (!profile) return undefined;
    return MIG_PROFILE_OPTIONS.find((opt) => opt.profile === profile)
      ?.availableCount;
  };

  /**
   * MIG 리소스 추가 핸들러
   */
  const handleAdd = () => {
    const validResource = validateAndGetResource();
    if (validResource) {
      onAdd(validResource);
      resetForm();
    }
  };

  return (
    <MigFormContainer className={className}>
      {/* 입력 섹션 */}
      <MigInputContainer>
        <CompoundDropdown
          theme="light"
          width="208px"
          height={30}
          placeholder="MIG 프로필을 선택해 주세요."
          value={tempProfile || undefined}
          onChange={(value) => {
            setTempProfile(
              typeof value === "string" ? value : String(value ?? ""),
            );
          }}
          status={inputError || error ? "error" : undefined}
          disabled={disabled}
        >
          {MIG_PROFILE_OPTIONS.map((option) => (
            <CompoundDropdown.Option
              key={option.profile}
              value={option.profile}
              display={option.profile}
            >
              {renderMigOption(option.profile, option.availableCount)}
            </CompoundDropdown.Option>
          ))}
        </CompoundDropdown>
        <InputNumber
          placeholder="개수"
          value={tempCount}
          onChange={(value) => {
            setTempCount(String(value ?? ""));
          }}
          width="60px"
          height="30px"
          min={1}
          max={getAvailableCount(tempProfile)}
          controls={true}
          status={inputError || error ? "error" : undefined}
          disabled={disabled}
        />
        <Button
          icon="Plus"
          iconSize={24}
          onClick={handleAdd}
          disabled={disabled}
        />
      </MigInputContainer>

      {/* MIG 리소스 목록 */}
      {value.length === 0 ? (
        <MigEmptyState>
          <MigEmptyIconCircle>
            <Icon name="Mig" size={24} color="#FFFFFF" />
          </MigEmptyIconCircle>
          <MigEmptyText>
            <MigEmptyTitle>MIG 리소스가 입력되지 않았습니다.</MigEmptyTitle>
            <MigEmptyDescription>
              MIG 리소스 입력 후 리소스를 요청해 주세요.
            </MigEmptyDescription>
          </MigEmptyText>
        </MigEmptyState>
      ) : (
        <ResourceList>
          {value.map((mig, index) => (
            <MigResourceRow key={`${mig.profile}-${index}`}>
              <CompoundDropdown
                theme="light"
                width="208px"
                height={30}
                placeholder="MIG 프로필을 선택해 주세요."
                value={mig.profile}
                onChange={(value) => {
                  onUpdate(index, {
                    profile:
                      typeof value === "string" ? value : String(value ?? ""),
                    count: mig.count,
                  });
                }}
                disabled={disabled}
              >
                {MIG_PROFILE_OPTIONS.map((option) => (
                  <CompoundDropdown.Option
                    key={option.profile}
                    value={option.profile}
                    display={option.profile}
                  >
                    {renderMigOption(option.profile, option.availableCount)}
                  </CompoundDropdown.Option>
                ))}
              </CompoundDropdown>
              <InputNumber
                value={mig.count}
                onChange={(value) => {
                  onUpdate(index, {
                    profile: mig.profile,
                    count: String(value ?? ""),
                  });
                }}
                width="60px"
                height="30px"
                min={1}
                max={getAvailableCount(mig.profile)}
                controls={true}
                disabled={disabled}
              />
              <Button
                icon="Delete"
                iconSize={24}
                onClick={() => onRemove(index)}
                disabled={disabled}
              />
            </MigResourceRow>
          ))}
        </ResourceList>
      )}
    </MigFormContainer>
  );
}

// ===== Styled Components =====

const MigFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  max-height: 110px;
  overflow-y: auto;
`;

const MigInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MigResourceRow = styled.div`
  display: flex;
  align-items: center;
gap: 4px;

`;

const ResourceList = styled.div`
  padding-top: 6px;
  border-top: 1px solid #e9e9e9;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MigEmptyState = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const MigEmptyIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #878898;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MigEmptyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  height: 36px;
`;

const MigEmptyTitle = styled.span`
  font-weight: 600;
  font-size: 11px;
  line-height: 12px;
  color: #333333;
`;

const MigEmptyDescription = styled.span`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #666666;
`;

const MigOptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
`;
