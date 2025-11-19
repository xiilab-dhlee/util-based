"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Dropdown, Input } from "xiilab-ui";

import { CreateModelButton } from "@/components/common/button/create-model-button";
import {
  MONITORING_NOTIFICATION_OPERATOR_OPTIONS,
  MONITORING_NOTIFICATION_TYPE_OPTIONS,
} from "@/constants/monitoring/monitoring-notification.constant";
import type { MonitoringNotificationSettingType } from "@/schemas/monitoring-notification.schema";
import { FormLabel } from "../common/form/form-label";

interface ManageMonitoringNotificationSettingsProps {
  defaultSettings?: MonitoringNotificationSettingType[];
}

export function ManageMonitoringNotificationSetting({
  defaultSettings = [],
}: ManageMonitoringNotificationSettingsProps) {
  const [settings, setSettings] = useState<MonitoringNotificationSettingType[]>(
    defaultSettings.length > 0
      ? defaultSettings
      : [{ item: "", operator: "", threshold: "", duration: "" }],
  );

  /**
   * props로 전달된 parameters가 변경될 때 내부 상태 동기화
   */
  useEffect(() => {
    if (defaultSettings.length > 0) {
      setSettings(defaultSettings);
    }
  }, [defaultSettings]);

  /**
   * 새로운 파라미터 추가 핸들러
   * 기존 파라미터 목록에 빈 키와 값을 가진 새로운 파라미터를 추가합니다.
   */
  const handleCreateSetting = () => {
    const newParameter: MonitoringNotificationSettingType = {
      item: "",
      operator: "",
      threshold: "",
      duration: "",
    };
    setSettings((prev) => [...prev, newParameter]);
  };

  const handleDeleteSetting = (index: number) => {
    if (settings.length > 1) {
      setSettings((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, item: string | null) => {
    setSettings((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], item: item || "" };
      return newParameters;
    });
  };

  const handleOperatorChange = (index: number, operator: string | null) => {
    setSettings((prev) => {
      const newParameters = [...prev];
      newParameters[index] = {
        ...newParameters[index],
        operator: operator || "",
      };
      return newParameters;
    });
  };

  const handleThresholdChange = (index: number, threshold: string) => {
    setSettings((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], threshold };
      return newParameters;
    });
  };

  const handleDurationChange = (index: number, duration: string) => {
    setSettings((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], duration };
      return newParameters;
    });
  };

  return (
    <div>
      <Header>
        <FormLabel>알림 임계 조건 설정</FormLabel>
        <CreateModelButton onClick={handleCreateSetting} title="설정 추가" />
      </Header>
      <Body>
        {/* 컬럼 헤더 */}
        <Column>
          <Field>
            <HeaderTitle>항목</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>연산자</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>임계값</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>지속시간</HeaderTitle>
          </Field>
          <Delete></Delete>
        </Column>
        {/* 파라미터 입력 필드들 */}
        {settings.map((setting, index) => (
          <Column key={setting.item}>
            {/* 항목 선택 필드 */}
            <Field>
              <Dropdown
                options={MONITORING_NOTIFICATION_TYPE_OPTIONS}
                placeholder="항목 선택"
                onChange={(value: string | null) =>
                  handleItemChange(index, value)
                }
                value={setting.item || null}
                width="100%"
                height={30}
              />
            </Field>
            {/* 연산자 선택 필드 */}
            <Field>
              <Dropdown
                options={MONITORING_NOTIFICATION_OPERATOR_OPTIONS}
                placeholder="연산자 선택"
                onChange={(value: string | null) =>
                  handleOperatorChange(index, value)
                }
                value={setting.operator || null}
                width="100%"
                height={30}
              />
            </Field>
            {/* 임계값 입력 필드 */}
            <Field>
              <Input
                width="100%"
                value={setting.threshold}
                onChange={(e) => handleThresholdChange(index, e.target.value)}
                autoComplete="off"
              />
            </Field>
            {/* 파라미터 값 입력 필드 */}
            <Field>
              <Input
                width="100%"
                value={setting.duration}
                onChange={(e) => handleDurationChange(index, e.target.value)}
                autoComplete="off"
              />
            </Field>
            {/* 파라미터 삭제 버튼 */}
            <Delete>
              <Button
                icon="Close"
                iconSize={18}
                onClick={() => handleDeleteSetting(index)}
                disabled={settings.length === 1}
              />
            </Delete>
          </Column>
        ))}
      </Body>
    </div>
  );
}

// ===== Styled Components =====

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

/**
 * 파라미터 입력 컨테이너
 * 테두리와 패딩을 가진 카드 형태의 레이아웃
 */
const Body = styled.div`
  border-radius: 4px;
  border: 1px solid #d1d5dc;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 6px;
  position: relative;
  width: 100%;
`;

/**
 * 컬럼 헤더 제목 스타일
 * 파라미터 키/값 라벨의 스타일링
 */
const HeaderTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;

/**
 * 파라미터 행 레이아웃
 * 키, 값, 삭제 버튼을 가로로 배치
 */
const Column = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

/**
 * 입력 필드 컨테이너
 * flex: 1로 동일한 너비를 가지며 오버플로우를 처리
 */
const Field = styled.div`
  flex: 1;
  overflow: hidden;
`;

/**
 * 삭제 버튼 컨테이너
 * 오른쪽 정렬된 30px 너비의 삭제 버튼 영역
 */
const Delete = styled.div`
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 6px;

  & > button {
    width: 30px !important;
    height: 30px !important;
  }
`;
