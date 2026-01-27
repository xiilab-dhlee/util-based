"use client";

import { isString } from "es-toolkit/predicate";
import { Dropdown } from "xiilab-ui";

import { useGetGroups } from "@/api/generated/group-registration/group-registration";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";

interface GroupSelectOnlySignupProps {
  value: string | null;
  setValue: (value: string | null) => void;
  disabled?: boolean;
}

function useGroupOptions() {
  const query = useGetGroups(
    { pageNo: 0, pageSize: 100 },
    {
      query: {
        select: (data) =>
          data?.content?.map((group) => ({
            label: group.groupName,
            value: group.groupId,
          })) ?? [],
      },
    },
  );

  return {
    options: query.data ?? [],
    isLoading: query.isLoading,
  };
}

/**
 * 회원가입 전용 그룹 선택 컴포넌트
 *
 * 회원가입 시 선택 가능한 그룹 목록을 조회하여 드롭다운으로 표시합니다.
 */
export function GroupSelectOnlySignup({
  value,
  setValue,
  disabled = false,
}: GroupSelectOnlySignupProps) {
  const { options, isLoading } = useGroupOptions();

  const handleChange = (v: string | number) => {
    if (isString(v)) {
      setValue(v);
    }
  };

  return (
    <Dropdown
      placeholder="그룹을 선택해 주세요."
      options={options}
      value={value}
      onChange={handleChange}
      width="100%"
      showSearch
      optionFilterProp="children"
      loading={isLoading}
      disabled={disabled || options.length === 0}
      listHeight={DROPDOWN_LIST_HEIGHT}
    />
  );
}
