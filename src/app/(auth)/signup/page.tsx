"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

import {
  type SignupFormType,
  signupSchema,
} from "@/domain/auth/schemas/signup.schema";
import { LoginBackgroundIcon } from "@/shared/components/icon/login-background";

export default function SignupPage() {
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
      groupName: "",
    },
  });

  const onSubmit = (data: SignupFormType) => {
    console.log("signup data:", data);
  };

  return (
    <Container>
      <Left>
        <LeftBody>
          <FormWrapper>
            <Header>
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
                  >
                    <Input
                      {...field}
                      type="email"
                      id="signup-email"
                      placeholder="이메일을 입력해 주세요."
                      width="100%"
                      height={36}
                      autoComplete="email"
                      prefix={
                        <Icon
                          name="LoginEmail"
                          color="var(--icon-fill)"
                          size={20}
                        />
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
                  >
                    <Input
                      {...field}
                      type="password"
                      id="signup-password"
                      placeholder="비밀번호를 입력해 주세요."
                      width="100%"
                      height={36}
                      autoComplete="new-password"
                      prefix={
                        <Icon name="Lock" color="var(--icon-fill)" size={20} />
                      }
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
                    validateStatus={
                      errors.confirmPassword ? "error" : undefined
                    }
                    htmlFor="signup-confirm-password"
                    help={errors.confirmPassword?.message}
                  >
                    <Input
                      {...field}
                      type="password"
                      id="signup-confirm-password"
                      placeholder="비밀번호를 다시 입력해 주세요."
                      width="100%"
                      height={36}
                      autoComplete="new-password"
                      prefix={
                        <Icon name="Lock" color="var(--icon-fill)" size={20} />
                      }
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
                    >
                      <Input
                        {...field}
                        type="text"
                        id="signup-first-name"
                        placeholder="이름을 입력해 주세요."
                        width="100%"
                        height={36}
                        autoComplete="given-name"
                        prefix={
                          <Icon
                            name="Name"
                            color="var(--icon-fill)"
                            size={20}
                          />
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
                    >
                      <Input
                        {...field}
                        type="text"
                        id="signup-last-name"
                        placeholder="성을 입력해 주세요."
                        width="100%"
                        height={36}
                        autoComplete="family-name"
                        prefix={
                          <Icon
                            name="Name"
                            color="var(--icon-fill)"
                            size={20}
                          />
                        }
                      />
                    </FormItem>
                  )}
                />
              </NameRow>
              <Controller
                name="groupName"
                control={control}
                render={({ field }) => (
                  <FormItem
                    label="Group Name"
                    validateStatus={errors.groupName ? "error" : undefined}
                    htmlFor="signup-group-name"
                    help={errors.groupName?.message}
                  >
                    <Dropdown
                      options={[
                        { label: "그룹 A", value: "group-a" },
                        { label: "그룹 B", value: "group-b" },
                        { label: "그룹 C", value: "group-c" },
                      ]}
                      value={field.value || null}
                      onChange={(value) => field.onChange(value)}
                      placeholder="그룹을 선택해 주세요. (선택)"
                      width="100%"
                      height={36}
                      status={errors.groupName ? "error" : undefined}
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
              >
                회원가입
              </SubmitButton>
            </StyledForm>
          </FormWrapper>
        </LeftBody>
        <LeftFooter>
          <Typography.Text variant="body-4-2" color="#828588">
            도움말｜개인정보처리방침｜이용약관
          </Typography.Text>
          <Typography.Text variant="body-4-2" color="#828588">
            (주)씨이랩｜대표이사 : 채정환, 윤세혁｜사업자등록번호 : 119-86-31534
          </Typography.Text>
        </LeftFooter>
      </Left>
      <Right>
        <LoginBackgroundIcon />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
`;

const Left = styled.div`
  width: 620px;
  height: 100%;
  margin: 0 90px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
`;

const LeftBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const LeftFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 36px;
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

  --icon-fill: #969A9F;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SubmitButton = styled(Button)`
  margin-top: 8px;
`;

const Right = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
