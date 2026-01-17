"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Button, Dropdown, Form, FormItem, Input } from "xiilab-ui";

import {
  getGetVolumeDetailQueryKey,
  getGetVolumeListQueryKey,
  useGetVolumeDetail,
  useUpdateVolume,
} from "@/api/generated/volume/volume";
import {
  type UpdateVolumeFormType,
  updateVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import {
  getVolumeStatusInfo,
  getVolumeStorageTypeInfo,
} from "@/domain/volume/utils/volume.util";
import { VISIBILITY_STATUS_OPTIONS } from "@/shared/constants/core.constant";
import { formatFileSize } from "@/shared/utils/file.util";
import {
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailFooter,
} from "@/styles/layers/aside-detail-layers.styled";

interface UpdateVolumeProps {
  volumeId: number;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}

export function UpdateVolume({
  volumeId,
  readOnly,
  setReadOnly,
}: UpdateVolumeProps) {
  const queryClient = useQueryClient();

  const { data } = useGetVolumeDetail(volumeId, {
    query: { enabled: !Number.isNaN(volumeId) },
  });

  const updateVolume = useUpdateVolume();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateVolumeFormType>({
    resolver: zodResolver(updateVolumeSchema),
    defaultValues: {
      volumeName: "",
      mountPath: "",
      isPublic: false,
    },
  });

  const { text } = getVolumeStorageTypeInfo(data?.volumeType);
  const { text: statusText } = getVolumeStatusInfo(data?.isPublic ?? false);

  const onSubmit = (formData: UpdateVolumeFormType) => {
    updateVolume.mutate(
      {
        volumeId,
        data: formData,
      },
      {
        onSuccess: () => {
          setReadOnly(true);
          toast.success("볼륨 수정 성공");
          queryClient.invalidateQueries({
            queryKey: getGetVolumeDetailQueryKey(volumeId),
          });
          queryClient.invalidateQueries({
            queryKey: getGetVolumeListQueryKey(),
          });
        },
      },
    );
  };

  const handleCancel = () => {
    if (data) {
      reset({
        volumeName: data.volumeName || "",
        mountPath: data.mountPath || "",
        isPublic: data.isPublic ?? false,
      });
    }
    setReadOnly(true);
  };

  useEffect(() => {
    if (data) {
      reset({
        volumeName: data.volumeName || "",
        mountPath: data.mountPath || "",
        isPublic: data.isPublic ?? false,
      });
    }
  }, [data, reset]);

  return (
    <>
      <StyledForm onFinish={handleSubmit(onSubmit)}>
        <StyledFormBody>
          <AsideDetailArticleItem>
            <AsideDetailArticleHeader>
              <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
            </AsideDetailArticleHeader>

            {readOnly ? (
              <>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>볼륨 이름</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    {data?.volumeName || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    {text}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>공개 설정</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {statusText}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>Mount Path</AsideDetailArticleKey>
                  <AsideDetailArticleValue className="truncate">
                    {data?.mountPath || "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </>
            ) : (
              <>
                <Controller
                  name="volumeName"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label="볼륨 이름"
                      required
                      validateStatus={errors.volumeName ? "error" : undefined}
                      help={errors.volumeName?.message}
                    >
                      <Input
                        {...field}
                        placeholder="볼륨 이름을 입력해 주세요."
                        width="100%"
                        autoComplete="off"
                      />
                    </FormItem>
                  )}
                />
                {readOnly && (
                  <AsideDetailArticleColumn>
                    <AsideDetailArticleKey>스토리지 타입</AsideDetailArticleKey>
                    <AsideDetailArticleValue className="truncate">
                      {text}
                    </AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                )}

                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label="공개 설정"
                      required
                      validateStatus={errors.isPublic ? "error" : undefined}
                      help={errors.isPublic?.message}
                    >
                      <Dropdown
                        options={VISIBILITY_STATUS_OPTIONS}
                        onChange={(value) => field.onChange(value === "PUBLIC")}
                        value={field.value ? "PUBLIC" : "PRIVATE"}
                        width="100%"
                        placeholder="공개 설정을 선택해 주세요."
                      />
                    </FormItem>
                  )}
                />
                <Controller
                  name="mountPath"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label="Mount Path"
                      required
                      validateStatus={errors.mountPath ? "error" : undefined}
                      help={errors.mountPath?.message}
                    >
                      <Input
                        {...field}
                        placeholder="마운트 경로를 입력해 주세요. (예: /mnt/data)"
                        width="100%"
                        autoComplete="off"
                      />
                    </FormItem>
                  )}
                />
              </>
            )}
          </AsideDetailArticleItem>

          <AsideDetailArticleItem>
            <AsideDetailArticleRow>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>설정 내용</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>
                {data?.volumeType === "ASTRAGO" && (
                  <>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>스토리지</AsideDetailArticleKey>
                      <AsideDetailArticleValue>
                        {data?.storageName || "-"}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>파일 용량</AsideDetailArticleKey>
                      <AsideDetailArticleValue>
                        {formatFileSize(data?.fileSizeByte ?? 0).formatted}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </>
                )}
                {data?.volumeType === "ON_PREMISE" && (
                  <>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>Server IP</AsideDetailArticleKey>
                      <AsideDetailArticleValue>
                        {data?.serverIp || "-"}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                    <AsideDetailArticleColumn>
                      <AsideDetailArticleKey>Server Path</AsideDetailArticleKey>
                      <AsideDetailArticleValue>
                        {data?.volumePath || "-"}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </>
                )}
              </AsideDetailArticleRowItem>
              <AsideDetailArticleRowItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성자</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.creatorName}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
                <AsideDetailArticleColumn>
                  <AsideDetailArticleKey>생성일</AsideDetailArticleKey>
                  <AsideDetailArticleValue>
                    {data?.createdAt && format(data?.createdAt, "yyyy.MM.dd")}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleRowItem>
            </AsideDetailArticleRow>
          </AsideDetailArticleItem>
        </StyledFormBody>

        {!readOnly && (
          <Footer>
            <Button width={112} variant="outlined" onClick={handleCancel}>
              취소
            </Button>
            <Button
              type="submit"
              color="primary"
              icon="Check"
              iconPosition="left"
              iconSize={20}
              size="medium"
              variant="gradient"
              width="100%"
              loading={updateVolume.isPending}
            >
              상세 정보 저장
            </Button>
          </Footer>
        )}
      </StyledForm>

      {/* {readOnly && (
        <SecondaryArticle>
          <AsideDetailArticleHeader>
            <AsideDetailArticleTitle>사용중인 워크로드</AsideDetailArticleTitle>
          </AsideDetailArticleHeader>
          <SecondaryArticleBody>
            <WorkloadList>
              {workloadPage === 1 &&
                workloadListMock
                  .slice(0, 8)
                  .map((workload) => (
                    <VolumeWorkloadCard key={workload.id} {...workload} />
                  ))}
              {workloadPage === 2 && <EmptyVolumeWorkload />}
            </WorkloadList>
            <ListPageFooter
              total={20}
              page={workloadPage}
              pageSize={10}
              onChange={setWorkloadPage}
            />
          </SecondaryArticleBody>
        </SecondaryArticle>
      )} */}
    </>
  );
}

const StyledForm = styled(Form)`
  gap: 16px;
  height: 100%;

  & form {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
`;

const StyledFormBody = styled(AsideDetailArticleBody)`
  flex: 1;

  padding: 20px;
  
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fcfcfc;
`;

// const SecondaryArticle = styled(AsideDetailArticle)`
//   flex: 1;
//   margin-top: 10px;
//   overflow: hidden;
// `;

// const SecondaryArticleBody = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   overflow: hidden;
// `;

// const WorkloadList = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   width: 100%;
//   gap: 12px;
//   overflow-y: auto;

//   ${customScrollbar()}
// `;

const Footer = styled(AsideDetailFooter)`
  align-items: flex-end;
  flex: 1;
`;
