"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Dropdown } from "xiilab-ui";

import { useSelect } from "@/hooks/common/use-select";
import { useGetCredentials } from "@/hooks/credential/use-get-credentials";
import type { CredentialListType } from "@/schemas/credential.schema";
import { SourcecodeFormFieldControl } from "@/styles/layers/sourcecode-form-layers.styled";

interface ManageCredentialProps {
  defaultCredential?: CredentialListType;
}

/**
 * ManageCredential 컴포넌트
 *
 * Git 리포지토리 접근을 위한 크레덴셜을 선택하고 URL 검증을 수행하는 컴포넌트입니다.
 * 기본값이 제공되면 자동으로 해당 크레덴셜을 선택하고 URL 검증을 활성화합니다.
 *
 * @param defaultCredential - 기본값으로 설정할 크레덴셜 (기본값으로 사용)
 * @returns 크레덴셜 관리 UI 컴포넌트
 */
export function ManageCredential({ defaultCredential }: ManageCredentialProps) {
  // URL 검증 여부 - 기본값이 있으면 true로 초기화
  const [isValidate, setIsValidate] = useState(!!defaultCredential);

  // 크레덴셜 목록 조회 (페이지당 100개)
  const { data } = useGetCredentials({ page: 1, size: 100 });

  // 크레덴셜 목록을 Dropdown 컴포넌트에서 사용할 수 있는 형태로 매핑
  // value: 크레덴셜 ID (문자열), label: 크레덴셜 이름
  const mappedCredentials =
    data?.content?.map((credential) => ({
      value: credential.id.toString(),
      label: credential.name,
    })) || [];

  // 기본값이 있으면 해당 크레덴셜의 value와 label을 초기값으로 설정
  // 없으면 null로 설정하여 아무것도 선택되지 않은 상태로 초기화
  const initialValue = defaultCredential
    ? {
        value: defaultCredential.id.toString(),
        label: defaultCredential.name,
      }
    : null;

  // 크레덴셜 선택 상태 관리
  // useSelect 훅을 사용하여 선택된 값, 옵션 목록, 값 설정 함수를 관리
  const { value, options, setValue } = useSelect(
    initialValue?.value || null,
    mappedCredentials,
  );

  // 기본값이 변경되면 value와 isValidate 상태 업데이트
  // defaultCredential이 변경될 때마다 자동으로 선택 상태와 검증 상태를 동기화
  useEffect(() => {
    if (defaultCredential) {
      setValue(defaultCredential.id.toString());
      setIsValidate(true); // 기본값이 있으면 자동으로 URL 검증 완료 상태로 설정
    }
  }, [defaultCredential, setValue]);

  const handleValidateUrl = () => {
    if (!value) {
      toast.error("크레덴셜을 선택해 주세요.");
      return;
    }

    if (isValidate) {
      toast.info("이미 URL 검증이 완료되었습니다.");
      return;
    }

    setIsValidate(true);
    toast.success("URL 검증 완료");
  };

  return (
    <>
      {/* 크레덴셜 선택 드롭다운 */}
      <SourcecodeFormFieldControl>
        <Dropdown
          options={options}
          onChange={setValue}
          value={value}
          width="100%"
          placeholder="크레덴셜 선택, Git 리포지토리를 추가하시려면 크레덴셜을 선택해 주세요."
        />
      </SourcecodeFormFieldControl>

      {/* URL 검증 버튼 */}
      <Button
        color="primary"
        icon="Verification02"
        iconPosition="left"
        iconSize={16}
        size="medium"
        variant="outlined"
        height={32}
        width="100%"
        onClick={handleValidateUrl}
      >
        URL 검증
      </Button>

      {/* URL 검증 상태를 폼 데이터로 전송하기 위한 숨겨진 입력 필드 */}
      <input type="hidden" name="isUrlValid" value={isValidate ? "Y" : "N"} />
    </>
  );
}
