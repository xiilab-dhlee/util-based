"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Form, Icon, Input, Modal, Typography } from "xiilab-ui";

import type { LicenseListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetLatestLicenseQueryKey,
  getGetLicensesQueryKey,
  useCreateLicense,
  useGetLicenses,
} from "@/api/generated/license/license";
import { createLicenseColumn } from "@/domain/system-setting/components/create-license-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  type LicenseFormType,
  licenseFormSchema,
} from "@/shared/schemas/license.schema";
import { errorTextStyle } from "@/styles/mixins/text";

/**
 * 라이선스 갱신 모달
 * 라이선스 키 입력 및 등록 이력 표시
 */
export function CreateLicenseModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetLicenses();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicenseFormType>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      licenseKey: "",
    },
  });

  const { mutate, isPending } = useCreateLicense();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: LicenseFormType) => {
    if (isPending) return;

    mutate(
      { data },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetLatestLicenseQueryKey(),
          });
          void queryClient.invalidateQueries({
            queryKey: getGetLicensesQueryKey(),
          });
          reset();
        },
      },
    );
  };

  useSubscribe(SYSTEM_SETTING_EVENTS.openLicenseRenewalModal, () => {
    reset();
    setOpen(true);
  });

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
                  <ErrorText>{errors.licenseKey.message}</ErrorText>
                )}
                <Controller
                  name="licenseKey"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="라이선스 키를 입력해 주세요. ex) 0000-0000-xxxx.."
                      disabled={isPending}
                      width="100%"
                      autoComplete="off"
                    />
                  )}
                />
              </FormItemWrapper>
              <Button
                onClick={handleSubmit(onSubmit)}
                loading={isPending}
                color="primary"
                variant="outlined"
                width="106px"
                height="36px"
              >
                등록하기
              </Button>
            </InputWithButton>
          </Form.Item>
        </Form>
        <HistorySection>
          <HistoryHeader>
            <Typography.Text variant="subtitle-2-1">
              라이선스 등록 이력 <CountText>총 {data?.length || 0}개</CountText>
            </Typography.Text>
          </HistoryHeader>
          <HistoryTableWrapper>
            <CustomizedTable<LicenseListResponse>
              columns={createLicenseColumn()}
              data={data || []}
              rowKey="licenseId"
              pagination={false}
              activePadding
              loading={isLoading}
              isError={isError}
            />
          </HistoryTableWrapper>
        </HistorySection>
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

const HistoryTableWrapper = styled.div`
  height: 300px;
`;

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
