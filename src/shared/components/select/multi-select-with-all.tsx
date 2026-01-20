import styled from "styled-components";
import type { TagGroupItem } from "xiilab-ui";
import { Checkbox, Dropdown, Tag, TagGroup } from "xiilab-ui";

import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { MultiSelectWithAllProps } from "./multi-select-with-all.types";

/**
 * 전체 선택 기능이 있는 다중 선택 드롭다운
 */
export function MultiSelectWithAll({
  id,
  options,
  value,
  onChange,
  allLabel = "전체",
  width,
  height,
  placeholder,
  disabled,
}: MultiSelectWithAllProps) {
  const isAllSelected = options.length > 0 && value.length === options.length;
  const isIndeterminate = value.length > 0 && value.length < options.length;

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return;

    if (optionValue === ALL_OPTION.value) {
      if (isAllSelected) {
        onChange([]);
      } else {
        onChange(options.map((opt) => opt.value));
      }
      return;
    }

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (tagValue: string) => {
    if (disabled) return;

    if (tagValue === ALL_OPTION.value) {
      onChange([]);
      return;
    }

    onChange(value.filter((v) => v !== tagValue));
  };

  const getTagGroupItems = (): TagGroupItem[] => {
    if (isAllSelected && options.length > 0) {
      return [
        {
          key: ALL_OPTION.value,
          label: allLabel,
          tagProps: {
            variant: "gray",
            closable: !disabled,
            onClose: () => handleRemoveTag(ALL_OPTION.value),
          },
        },
      ];
    }

    return value.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return {
        key: val,
        label: option?.label || val,
        tagProps: {
          variant: "gray",
          closable: !disabled,
          onClose: () => handleRemoveTag(val),
        },
      };
    });
  };

  const dropdownOptions = [
    { label: allLabel, value: ALL_OPTION.value },
    ...options.map((opt) => ({ label: opt.label, value: opt.value })),
  ];

  const dropdownValue = value.length > 0 ? value[0] : undefined;

  return (
    <Container $width={width}>
      <Dropdown
        id={id}
        options={dropdownOptions}
        value={dropdownValue}
        onChange={(selectedValue) => {
          if (
            typeof selectedValue === "string" ||
            typeof selectedValue === "number"
          ) {
            handleOptionClick(String(selectedValue));
          }
        }}
        width={width}
        height={height}
        placeholder={placeholder}
        disabled={disabled}
        optionRender={(option) => {
          const optionValue = String(option.value);
          const isAllOption = optionValue === ALL_OPTION.value;

          let isChecked = false;
          if (isAllOption) {
            isChecked = isAllSelected;
          } else {
            isChecked = value.includes(optionValue);
          }

          const showIndeterminate = isAllOption && isIndeterminate;

          return (
            <OptionContainer
              $isSelected={isChecked}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionClick(optionValue);
              }}
            >
              <Checkbox
                size="small"
                checked={isChecked}
                indeterminate={showIndeterminate}
                disabled={disabled}
              >
                <OptionLabel $isSelected={isChecked}>
                  {option.label}
                </OptionLabel>
              </Checkbox>
            </OptionContainer>
          );
        }}
        labelRender={() => {
          if (value.length === 0) {
            return <Placeholder>{placeholder}</Placeholder>;
          }

          if (isAllSelected && options.length > 0) {
            return (
              <TagGroupContainer onClick={(e) => e.stopPropagation()}>
                <Tag
                  variant="gray"
                  closable={!disabled}
                  onClose={() => handleRemoveTag(ALL_OPTION.value)}
                >
                  {allLabel}
                </Tag>
              </TagGroupContainer>
            );
          }

          return (
            <TagGroupContainer onClick={(e) => e.stopPropagation()}>
              <TagGroup items={getTagGroupItems()} />
            </TagGroupContainer>
          );
        }}
      />
    </Container>
  );
}

const Container = styled.div<{ $width?: number }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};
`;

const Placeholder = styled.span`
  color: var(--color-gray-06);
`;

const TagGroupContainer = styled.div`
  width: 100%;
`;

const OptionContainer = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const OptionLabel = styled.span<{ $isSelected?: boolean }>`
  font-size: 12px;
  line-height: 16px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  color: ${({ $isSelected }) => ($isSelected ? "#382CE0" : "inherit")};

  ${OptionContainer}:hover & {
    font-weight: 600;
    color: #382CE0;
  }
`;
