"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { FormItem, Icon, Input, Typography } from "xiilab-ui";

import { useCreateLicense } from "@/api/generated/license/license";
import {
  type LicenseFormType,
  licenseFormSchema,
} from "@/shared/schemas/license.schema";
import {
  AuthContainer,
  AuthForm,
  AuthHeader,
  AuthSubmitButton,
  AuthTitle,
  AuthTitleIconWrapper,
} from "@/styles/layers/auth-layers.styled";

/**
 * 라이선스 등록 페이지의 메인 컴포넌트
 *
 * 유효성 검증 규칙:
 * - License Key: 필수
 */
export function LicenseMain() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LicenseFormType>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      licenseKey: "",
    },
  });

  const { mutate, isPending } = useCreateLicense();

  const onSubmit = (data: LicenseFormType) => {
    if (isPending) return;

    mutate(
      {
        data: {
          licenseKey: data.licenseKey,
        },
      },
      {
        onSuccess: () => {
          void signIn("keycloak", { callbackUrl: "/" });
        },
      },
    );
  };

  return (
    <AuthContainer>
      <AuthHeader>
        <AuthTitle>
          <AuthTitleIconWrapper>
            <Icon name="Astrago" color="var(--icon-fill)" size={30} />
          </AuthTitleIconWrapper>
          <Typography.Text variant="headline-1-1" color="#000">
            License Registration
          </Typography.Text>
        </AuthTitle>
        <Typography.Text variant="subtitle-2-3" color="#333">
          인증을 위해 라이선스 키를 등록해 주세요.
        </Typography.Text>
      </AuthHeader>
      <AuthForm onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="licenseKey"
          control={control}
          render={({ field }) => (
            <FormItem
              label="License Key"
              required
              validateStatus={errors.licenseKey ? "error" : undefined}
              htmlFor="license-key"
              help={errors.licenseKey?.message}
            >
              <Input
                {...field}
                type="password"
                id="license-key"
                placeholder="라이선스 키를 입력해 주세요."
                width="100%"
                height={36}
                autoComplete="off"
                prefix={<Icon name="Code" color="var(--icon-fill)" size={20} />}
              />
            </FormItem>
          )}
        />
        <AuthSubmitButton
          type="submit"
          color="primary"
          variant="gradient"
          width="100%"
          height={34}
          loading={isPending}
        >
          인증하기
        </AuthSubmitButton>
      </AuthForm>
    </AuthContainer>
  );
}
