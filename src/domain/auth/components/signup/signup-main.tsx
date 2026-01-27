"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { FormItem, Icon, Input, Typography } from "xiilab-ui";

import {
  useCheckSuperAdminExists,
  useSignup,
} from "@/api/generated/account-registration/account-registration";
import { CompleteSignup } from "@/domain/auth/components/signup/complete-signup";
import { GroupSelectOnlySignup } from "@/domain/auth/components/signup/group-select-only-signup";
import {
  type SignupFormType,
  signupSchema,
} from "@/domain/auth/schemas/signup.schema";
import { ROUTES } from "@/shared/constants/routes.constant";
import { AUTH_SELECTOR } from "@/shared/constants/selector.constant";
import {
  AuthContainer,
  AuthForm,
  AuthHeader,
  AuthSubmitButton,
  AuthTitle,
  AuthTitleIconWrapper,
} from "@/styles/layers/auth-layers.styled";

interface SignupMainProps {
  /**
   * 회원가입 모드 (accountRole)
   * - USER: 일반 사용자 (기본값)
   * - SUPER_ADMIN: 슈퍼 관리자
   */
  mode?: "USER" | "SUPER_ADMIN";
}

/**
 * 회원가입 페이지의 메인 컴포넌트
 *
 * 유효성 검증 규칙:
 * - Email: 필수, 이메일 형식
 * - Password: 필수, 영문/숫자/특수문자 조합 8~16자
 * - Confirm Password: 필수, Password와 일치
 * - First Name: 필수, 최대 25자
 * - Last Name: 필수, 최대 25자
 *
 * 회원가입 성공 시 페이지 이동 없이 성공 UI를 표시합니다.
 */
export function SignupMain({ mode = "USER" }: SignupMainProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  // SUPER_ADMIN 모드일 때만 슈퍼 관리자 존재 여부 확인
  const { data: superAdminData, isLoading: isSuperAdminLoading } =
    useCheckSuperAdminExists({
      query: {
        enabled: mode === "SUPER_ADMIN",
      },
    });

  // SUPER_ADMIN 모드에서 이미 슈퍼 관리자가 존재하면 error 페이지로 리다이렉트
  useEffect(() => {
    if (mode === "SUPER_ADMIN" && superAdminData?.hasSuperAdmin) {
      router.replace(`${ROUTES.ERROR}?error=SuperAdminAlreadyExists`);
    }
  }, [mode, superAdminData?.hasSuperAdmin, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      groupId: [],
    },
  });

  const { mutate, isPending } = useSignup();

  const onSubmit = (data: SignupFormType) => {
    if (isPending) {
      return;
    }

    mutate(
      {
        data: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          accountRole: mode,
          ...(data.groupId?.length && { groupId: data.groupId }),
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
  };

  // SUPER_ADMIN 모드: 체크 중이거나 이미 슈퍼 관리자가 존재하면 렌더링 안함
  if (
    mode === "SUPER_ADMIN" &&
    (isSuperAdminLoading || superAdminData?.hasSuperAdmin)
  ) {
    return null;
  }

  // 회원가입 성공 UI
  if (isSuccess) {
    return <CompleteSignup />;
  }

  return (
    <AuthContainer>
      <AuthHeader data-testid={AUTH_SELECTOR.SIGNUP_HEADER}>
        <AuthTitle>
          <AuthTitleIconWrapper>
            <Icon name="Astrago" color="var(--icon-fill)" size={30} />
          </AuthTitleIconWrapper>
          <Typography.Text variant="headline-1-1" color="#000">
            Sign up
          </Typography.Text>
        </AuthTitle>
        <Typography.Text variant="subtitle-2-3" color="#333">
          AstraGo 신규 회원 가입을 환영합니다.
        </Typography.Text>
      </AuthHeader>
      <AuthForm onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem
              label="E-mail"
              required
              validateStatus={errors.email ? "error" : undefined}
              htmlFor="signup-email"
              help={errors.email?.message}
              data-testid={AUTH_SELECTOR.SIGNUP_EMAIL_FIELD}
            >
              <Input
                {...field}
                type="email"
                id="signup-email"
                placeholder="이메일을 입력해 주세요."
                width="100%"
                height={36}
                autoComplete="off"
                data-testid={AUTH_SELECTOR.SIGNUP_EMAIL_INPUT}
                prefix={
                  <Icon name="LoginEmail" color="var(--icon-fill)" size={20} />
                }
              />
            </FormItem>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Password"
              required
              validateStatus={errors.password ? "error" : undefined}
              htmlFor="signup-password"
              help={errors.password?.message}
              data-testid={AUTH_SELECTOR.SIGNUP_PASSWORD_FIELD}
            >
              <Input
                {...field}
                type="password"
                id="signup-password"
                placeholder="영문, 숫자, 특수문자 포함 8~16자 이내로 입력해 주세요."
                width="100%"
                height={36}
                maxLength={16}
                autoComplete="new-password"
                data-testid={AUTH_SELECTOR.SIGNUP_PASSWORD_INPUT}
                prefix={<Icon name="Lock" color="var(--icon-fill)" size={20} />}
              />
            </FormItem>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Confirm Password"
              required
              validateStatus={errors.confirmPassword ? "error" : undefined}
              htmlFor="signup-confirm-password"
              help={errors.confirmPassword?.message}
              data-testid={AUTH_SELECTOR.SIGNUP_CONFIRM_PASSWORD_FIELD}
            >
              <Input
                {...field}
                type="password"
                id="signup-confirm-password"
                placeholder="비밀번호를 한 번 더 입력해 주세요."
                width="100%"
                height={36}
                maxLength={16}
                autoComplete="new-password"
                data-testid={AUTH_SELECTOR.SIGNUP_CONFIRM_PASSWORD_INPUT}
                prefix={<Icon name="Lock" color="var(--icon-fill)" size={20} />}
              />
            </FormItem>
          )}
        />
        <NameRow>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <FormItem
                label="First Name"
                required
                validateStatus={errors.firstName ? "error" : undefined}
                htmlFor="signup-first-name"
                help={errors.firstName?.message}
                data-testid={AUTH_SELECTOR.SIGNUP_FIRST_NAME_FIELD}
              >
                <Input
                  {...field}
                  type="text"
                  id="signup-first-name"
                  placeholder="이름을 입력해 주세요."
                  width="100%"
                  height={36}
                  maxLength={25}
                  autoComplete="off"
                  data-testid={AUTH_SELECTOR.SIGNUP_FIRST_NAME_INPUT}
                  prefix={
                    <Icon name="Name" color="var(--icon-fill)" size={20} />
                  }
                />
              </FormItem>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <FormItem
                label="Last Name"
                required
                validateStatus={errors.lastName ? "error" : undefined}
                htmlFor="signup-last-name"
                help={errors.lastName?.message}
                data-testid={AUTH_SELECTOR.SIGNUP_LAST_NAME_FIELD}
              >
                <Input
                  {...field}
                  type="text"
                  id="signup-last-name"
                  placeholder="성을 입력해 주세요."
                  width="100%"
                  height={36}
                  maxLength={25}
                  autoComplete="off"
                  data-testid={AUTH_SELECTOR.SIGNUP_LAST_NAME_INPUT}
                  prefix={
                    <Icon name="Name" color="var(--icon-fill)" size={20} />
                  }
                />
              </FormItem>
            )}
          />
        </NameRow>
        <Controller
          name="groupId"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Group"
              validateStatus={errors.groupId ? "error" : undefined}
              htmlFor="signup-group-id"
              help={errors.groupId?.message}
              data-testid={AUTH_SELECTOR.SIGNUP_GROUP_NAME_FIELD}
            >
              <GroupSelectOnlySignup
                value={field.value?.[0] ?? null}
                setValue={(value) => {
                  field.onChange(value ? [value] : []);
                }}
              />
            </FormItem>
          )}
        />
        <AuthSubmitButton
          type="submit"
          color="primary"
          variant="gradient"
          width="100%"
          height={44}
          loading={isPending}
          data-testid={AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON}
        >
          회원가입
        </AuthSubmitButton>
      </AuthForm>
      <Footer>
        <Typography.Text variant="body-2-4" color="#333">
          계정이 있으신가요?
        </Typography.Text>
        <StyledLink
          href={ROUTES.AUTH_SIGNIN}
          data-testid={AUTH_SELECTOR.SIGNUP_LOGIN_LINK}
        >
          <Typography.Text variant="body-2-3" color="#544AD8">
            로그인하기
          </Typography.Text>
        </StyledLink>
      </Footer>
    </AuthContainer>
  );
}

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const StyledLink = styled(Link)`
  color: #544ad8;
  text-decoration: underline;
  text-underline-offset: 2px;
`;
