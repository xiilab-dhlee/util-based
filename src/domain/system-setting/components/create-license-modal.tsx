"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Form, Icon, Input, Modal, Typography } from "xiilab-ui";

import { createLicenseColumn } from "@/domain/system-setting/components/create-license-column";
import { useGetLicense } from "@/domain/system-setting/hooks/use-get-license";
import { useLicenseForm } from "@/domain/system-setting/hooks/use-license-form";
import { useUpdateLicense } from "@/domain/system-setting/hooks/use-update-license";
import type { LicenseDetailType } from "@/domain/system-setting/schemas/license.schema";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { errorTextStyle } from "@/styles/mixins/text";

/**
 * 라이선스 갱신 모달
 * 라이선스 키 입력 및 등록 이력 표시
 */
export function CreateLicenseModal() {
  const [open, setOpen] = useState(false);
  const { data: licenseData } = useGetLicense();
  const updateMutation = useUpdateLicense();
  const { formState, errors, setField, validate, reset } = useLicenseForm();

  // PubSub 구독: 모달 열기 이벤트
  useSubscribe(
    SYSTEM_SETTING_EVENTS.openLicenseRenewalModal,
    useCallback(() => {
      reset();
      setOpen(true);
    }, [reset]),
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const handleSubmit = () => {
    // 폼 검증
    const payload = validate();
    console.log("Validation errors:", errors);
    if (!payload) {
      return;
    }
  };

  const handleLicenseKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("licenseKey", e.target.value);
    },
    [setField],
  );

  const columns = createLicenseColumn();

  return (
    <Modal
      open={open}
      type="primary"
      icon={<Icon name="License" color="#fff" size={18} />}
      modalWidth={580}
      closable
      title="라이선스 갱신"
      onCancel={handleCancel}
      centered
      showHeaderBorder
      footer={null}
    >
      <ModalContent>
        <Form>
          {/* 라이선스 키 입력 */}
          <Form.Item
            label="라이선스 키"
            required
            validateStatus={errors.licenseKey ? "error" : undefined}
          >
            <InputWithButton>
              <FormItemWrapper>
                {errors.licenseKey && (
                  <ErrorText>{errors.licenseKey}</ErrorText>
                )}
                <Input
                  type="password"
                  placeholder="라이선스 키를 입력해 주세요. ex) 0000-0000-xxxx.."
                  value={formState.licenseKey}
                  onChange={handleLicenseKeyChange}
                  disabled={updateMutation.isPending}
                  width="100%"
                />
              </FormItemWrapper>
              <Button
                onClick={handleSubmit}
                loading={updateMutation.isPending}
                disabled={updateMutation.isPending}
                color="primary"
                variant="outlined"
                width="106px"
              >
                등록하기
              </Button>
            </InputWithButton>
          </Form.Item>
        </Form>

        {/* 등록 이력 */}
        {licenseData && licenseData.history.length > 0 && (
          <HistorySection>
            <HistoryHeader>
              <Typography.Text variant="subtitle-2-1">
                라이선스 등록 이력{" "}
                <CountText>총 {licenseData.totalCount}개</CountText>
              </Typography.Text>
            </HistoryHeader>
            <StyledTable<LicenseDetailType>
              columns={columns}
              data={licenseData.history}
              rowKey="id"
              pagination={false}
              activePadding
            />
          </HistorySection>
        )}
      </ModalContent>
    </Modal>
  );
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;

  > div:first-child {
    flex: 1;
  }
`;

const HistorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CountText = styled.span`
  margin-left: 8px;
  font-size: 14px;
  font-weight: 400;
`;

const StyledTable = styled(CustomizedTable)<LicenseDetailType>`
  max-height: 300px;
  overflow-y: auto;
` as typeof CustomizedTable;

const FormItemWrapper = styled.div`
  position: relative;
`;

const ErrorText = styled.span`
  ${errorTextStyle}
  position: absolute;
  top: -22px;
  right: 0;
  z-index: 10;
  pointer-events: none;
`;
