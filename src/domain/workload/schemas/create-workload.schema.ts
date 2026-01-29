import { z as zod } from "zod";

import {
  createWorkloadBody,
  createWorkloadBodyExecutionCmdMax,
  createWorkloadBodyExecutionDirectoryMax,
  createWorkloadBodyHarborImageNameMax,
  createWorkloadBodyImageTagNameMax,
  createWorkloadBodyPortItemPortNameMax,
  createWorkloadBodyWorkloadNameMax,
} from "@/api/generated/workload/workload.zod";
import {
  WORKLOAD_IMAGE_TYPES,
  WORKLOAD_JOB_TYPES,
  WORKLOAD_NODE_MODES,
} from "@/domain/workload/constants/workload.constant";

const requiredText = (message: string, maxLength: number) =>
  zod.string().min(1, message).max(maxLength, message);

const PORT_NAME_RULE_MESSAGE =
  "포트 이름은 RFC6335 규칙을 따라야 합니다: 1~15자, 소문자/숫자/하이픈, 최소 1개 영문자, 연속 하이픈 불가";
const PORT_NAME_REGEX = /^(?=.{1,15}$)(?=.*[a-z])[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const portFormSchema = createWorkloadBody.shape.port
  .unwrap()
  .element.extend({
    portName: zod
      .string()
      .min(1, "포트 이름을 입력해 주세요.")
      .max(createWorkloadBodyPortItemPortNameMax, PORT_NAME_RULE_MESSAGE)
      .regex(PORT_NAME_REGEX, PORT_NAME_RULE_MESSAGE),
  });

const envItemSchema = createWorkloadBody.shape.env.unwrap().element;
export const envFormSchema = zod.array(envItemSchema).optional();

const baseCreateWorkloadFormSchema = createWorkloadBody.extend({
  workloadName: requiredText(
    "워크로드 이름을 입력해 주세요.",
    createWorkloadBodyWorkloadNameMax,
  ),
  harborImageName: zod
    .string()
    .max(createWorkloadBodyHarborImageNameMax)
    .optional(),
  imageTagName: zod.string().max(createWorkloadBodyImageTagNameMax).optional(),
  imageType: zod
    .enum([
      WORKLOAD_IMAGE_TYPES.HUB,
      WORKLOAD_IMAGE_TYPES.BUILT_IN,
      WORKLOAD_IMAGE_TYPES.PRIVATE,
      WORKLOAD_IMAGE_TYPES.PUBLIC,
    ])
    .nullable()
    .optional(),
  distributedType: zod.string().nullable().optional(),
  executionDirectory: zod
    .string()
    .max(
      createWorkloadBodyExecutionDirectoryMax,
      "실행 경로는 1000자 이하여야 합니다.",
    )
    .optional(),
  executionCmd: zod
    .string()
    .max(
      createWorkloadBodyExecutionCmdMax,
      "실행 명령어는 1000자 이하여야 합니다.",
    )
    .optional(),
  resourcePresetId: zod.number().nullable(),
  env: envFormSchema,
  port: zod.array(portFormSchema).optional(),
});

export const createWorkloadFormSchema =
  baseCreateWorkloadFormSchema.superRefine((values, ctx) => {
    if (values.resourcePresetId === null) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "리소스 프리셋을 선택해 주세요.",
        path: ["resourcePresetId"],
      });
    }

    if (!values.imageType) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "이미지 타입을 선택해 주세요.",
        path: ["imageType"],
      });
    }

    if (values.imageType) {
      if (!values.harborImageName || values.harborImageName.trim() === "") {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "이미지를 선택해 주세요.",
          path: ["harborImageName"],
        });
      }

      if (!values.imageTagName || values.imageTagName.trim() === "") {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: "이미지 태그를 선택해 주세요.",
          path: ["imageTagName"],
        });
      }
    }

    const isDistributedLearning =
      values.workloadJobType === WORKLOAD_JOB_TYPES.BATCH &&
      values.nodeType === WORKLOAD_NODE_MODES.MULTI;
    if (!isDistributedLearning) {
      return;
    }

    if (!values.distributedType || values.distributedType.trim() === "") {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "분산 학습 타입을 선택해 주세요.",
        path: ["distributedType"],
      });
    }

    if (!values.workerCount || values.workerCount < 1) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: "Worker 수를 1 이상 입력해 주세요.",
        path: ["workerCount"],
      });
    }
  });

export type CreateWorkloadFormValues = zod.infer<
  typeof createWorkloadFormSchema
>;

export const createWorkloadStepSchemas = [
  baseCreateWorkloadFormSchema.pick({
    workloadJobType: true,
    workloadName: true,
    description: true,
    label: true,
  }),
  baseCreateWorkloadFormSchema.pick({
    nodeType: true,
    resourcePresetId: true,
    distributedType: true,
    workerCount: true,
    imageType: true,
    harborImageName: true,
    imageTagName: true,
  }),
  baseCreateWorkloadFormSchema.pick({
    sourceCode: true,
    volume: true,
  }),
  baseCreateWorkloadFormSchema.pick({
    outputDirectory: true,
    executionDirectory: true,
    executionCmd: true,
    env: true,
    port: true,
    parameter: true,
  }),
] as const;

export const createWorkloadStepFields = [
  ["workloadJobType", "workloadName", "description", "label"] satisfies Array<
    keyof CreateWorkloadFormValues
  >,
  [
    "nodeType",
    "resourcePresetId",
    "distributedType",
    "workerCount",
    "imageType",
    "harborImageName",
    "imageTagName",
  ] satisfies Array<keyof CreateWorkloadFormValues>,
  ["sourceCode", "volume"] satisfies Array<keyof CreateWorkloadFormValues>,
  [
    "outputDirectory",
    "executionDirectory",
    "executionCmd",
    "env",
    "port",
    "parameter",
  ] satisfies Array<keyof CreateWorkloadFormValues>,
] as const;
