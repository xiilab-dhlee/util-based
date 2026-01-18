"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isString } from "es-toolkit/predicate";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Button,
  Dropdown,
  Form,
  FormItem,
  Icon,
  Input,
  Typography,
} from "xiilab-ui";

import { useSignup } from "@/api/generated/account/account";
import {
  type SignupFormType,
  signupSchema,
} from "@/domain/auth/schemas/signup.schema";
import { AUTH_SELECTOR } from "@/shared/constants/selector.constant";
import { CompleteSignup } from "./complete-signup";

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
export function SignupMain() {
  const [isSuccess, setIsSuccess] = useState(false);

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

  const { mutate: signup, isPending } = useSignup();

  const onSubmit = (data: SignupFormType) => {
    if (isPending) return;

    signup(
      {
        data: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          accountRole: "USER",
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

  // 회원가입 성공 UI
  if (isSuccess) {
    return <CompleteSignup />;
  }

  return (
    <Container>
      <Header data-testid={AUTH_SELECTOR.SIGNUP_HEADER}>
        <Title>
          <TitleIconWrapper>
            <Icon name="Astrago" color="var(--icon-fill)" size={30} />
          </TitleIconWrapper>
          <Typography.Text variant="headline-1-1" color="#000">
            Sign up
          </Typography.Text>
        </Title>
        <Typography.Text variant="subtitle-2-3" color="#333">
          AstraGo 신규 회원 가입을 환영합니다.
        </Typography.Text>
      </Header>
      <StyledForm onFinish={handleSubmit(onSubmit)}>
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
              <Dropdown
                options={[
                  { label: "그룹 A", value: "group-a" },
                  { label: "그룹 B", value: "group-b" },
                  { label: "그룹 C", value: "group-c" },
                ]}
                value={field.value?.[0] ?? null}
                onChange={(value) =>
                  field.onChange(isString(value) ? [value] : [])
                }
                placeholder="그룹을 선택해 주세요."
                width="100%"
                height={36}
                status={errors.groupId ? "error" : undefined}
              />
            </FormItem>
          )}
        />
        <SubmitButton
          type="submit"
          color="primary"
          variant="gradient"
          width="100%"
          height={44}
          loading={isPending}
          data-testid={AUTH_SELECTOR.SIGNUP_SUBMIT_BUTTON}
        >
          회원가입
        </SubmitButton>
      </StyledForm>
      <Footer>
        <Typography.Text variant="body-2-4" color="#333">
          계정이 있으신가요?
        </Typography.Text>
        <StyledLink
          href="/signin"
          data-testid={AUTH_SELECTOR.SIGNUP_LOGIN_LINK}
        >
          <Typography.Text variant="body-2-3" color="#544AD8">
            로그인하기
          </Typography.Text>
        </StyledLink>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 36px;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const TitleIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #5b29c7;
  margin-right: 6px;
  overflow: hidden;

  --icon-fill: #fff;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  --icon-fill: #969a9f;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SubmitButton = styled(Button)`
  margin-top: 8px;
`;

const StyledLink = styled(Link)`
  color: #544AD8;
  text-decoration: underline;
  text-underline-offset: 2px;
`;
