import {
  type GetSourceCodeListCodeType,
  type GetSourceCodeListOrder,
  type GetSourceCodeListSort,
  type SourceCodeListResponse,
  SourceCodeListResponseSourceCodeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetSourceCodeListMockHandler,
  getGetSourceCodeListResponseMock,
} from "@/api/generated/source-code/source-code.msw";
import {
  DAY_IN_MS,
  MOCK_BASE_TIMESTAMP,
} from "@/shared/constants/date.constant";

/** API 스키마에서 정의된 소스코드 타입 값 배열 */
const SOURCE_CODE_TYPES = Object.values(SourceCodeListResponseSourceCodeType);

/**
 * 정렬 가능한 sourceCodeName 생성
 * 정렬 시 순서가 올바르게 유지되도록 숫자 패딩 사용
 * ASC: sourcecode-001, sourcecode-002, ... (오름차순)
 * DESC: sourcecode-999, sourcecode-998, ... (내림차순)
 *
 * keyword가 있는 경우에도 sort/order를 적용하여 정렬 순서 보장
 */
function generateSourceCodeName(
  index: number,
  keyword: string,
  sort: GetSourceCodeListSort,
  order: GetSourceCodeListOrder,
): string {
  const prefix = keyword || "sourcecode";

  if (sort === "SOURCE_CODE_NAME") {
    // 3자리 숫자로 패딩하여 정렬 순서 보장
    const paddedIndex = String((index % 1000) + 1).padStart(3, "0");
    // ASC: 001, 002, 003... / DESC: 999, 998, 997...
    const sortableValue = 999 - (index % 1000);
    const sortableNum =
      order === "ASC" ? paddedIndex : String(sortableValue).padStart(3, "0");
    return `${prefix}-${sortableNum}`;
  }

  return `${prefix}-${index + 1}`;
}

/**
 * 정렬 가능한 createdAt 생성
 * ASC: 오래된 날짜부터 (과거 → 현재)
 * DESC: 최신 날짜부터 (현재 → 과거)
 *
 * @param index - 데이터 인덱스
 * @param sort - 정렬 기준
 * @param order - 정렬 순서
 * @param baseTimestamp - 기준 시간 (기본값: MOCK_BASE_TIMESTAMP)
 */
function generateCreatedAt(
  index: number,
  sort: GetSourceCodeListSort,
  order: GetSourceCodeListOrder,
  baseTimestamp: number = MOCK_BASE_TIMESTAMP,
): string {
  if (sort === "CREATED_AT") {
    // index를 [0, 29] 범위로 클램프하여 미래 날짜 방지
    const safeIndex = Math.min(Math.max(index, 0), 29);
    // 정렬 순서에 맞게 날짜 생성
    const offset =
      order === "ASC"
        ? (30 - safeIndex) * DAY_IN_MS // ASC: 오래된 것부터 (30일 전 → 현재)
        : safeIndex * DAY_IN_MS; // DESC: 최신 것부터 (현재 → 과거)
    return new Date(baseTimestamp - offset).toISOString();
  }

  // 기본: 최신순
  return new Date(baseTimestamp - index * DAY_IN_MS).toISOString();
}

/**
 * Git URL 생성
 * @param index - 데이터 인덱스
 * @param type - 소스코드 타입
 */
function generateGitUrl(
  index: number,
  type: SourceCodeListResponseSourceCodeType,
): string {
  const repoName = `project-${index + 1}`;

  switch (type) {
    case "GITHUB":
      return `https://github.com/organization/${repoName}`;
    case "GITLAB":
      return `https://gitlab.com/organization/${repoName}`;
    case "BITBUCKET":
      return `https://bitbucket.org/organization/${repoName}`;
    default:
      return `https://github.com/organization/${repoName}`;
  }
}

/**
 * Mount Path 생성
 * @param index - 데이터 인덱스
 */
function generateMountPath(index: number): string {
  return `/workspace/src/project-${index + 1}`;
}

/**
 * 실행 명령어 생성
 * @param index - 데이터 인덱스
 */
function generateExecutionCmd(index: number): string {
  const commands = [
    "python main.py",
    "npm run start",
    "bash run.sh",
    "./train.py --epochs 100",
    "python -m torch.distributed.launch train.py",
  ];
  return commands[index % commands.length];
}

/**
 * 타입 필터에 따른 소스코드 타입 결정
 * @param index - 데이터 인덱스
 * @param codeType - 필터링할 타입 (없으면 모든 타입 순환)
 */
function getSourceCodeType(
  index: number,
  codeType?: GetSourceCodeListCodeType,
): SourceCodeListResponseSourceCodeType {
  if (codeType) {
    // 타입 필터가 적용된 경우 해당 타입만 반환
    return codeType as SourceCodeListResponseSourceCodeType;
  }
  // 필터 없으면 타입 순환
  return SOURCE_CODE_TYPES[index % SOURCE_CODE_TYPES.length];
}

export const sourcecodeListOverrideHandlers = [
  // 소스코드 목록 조회 (pageSize에 맞는 개수, keyword/sort/order/codeType 지원)
  getGetSourceCodeListMockHandler(async (info) => {
    // URL에서 query params 추출
    const url = new URL(info.request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const pageNo = Number.parseInt(url.searchParams.get("pageNo") || "0", 10);
    const pageSize = Number.parseInt(
      url.searchParams.get("pageSize") || "12",
      10,
    );
    const sort = (url.searchParams.get("sort") ||
      "SOURCE_CODE_NAME") as GetSourceCodeListSort;
    const order = (url.searchParams.get("order") ||
      "ASC") as GetSourceCodeListOrder;
    const codeType = url.searchParams.get(
      "codeType",
    ) as GetSourceCodeListCodeType | null;

    const { status, message, timestamp } = getGetSourceCodeListResponseMock();

    // pageSize에 맞는 content 생성
    const content: SourceCodeListResponse[] = Array.from(
      { length: pageSize },
      (_, index) => {
        const globalIndex = pageNo * pageSize + index;
        const sourceCodeType = getSourceCodeType(
          globalIndex,
          codeType || undefined,
        );

        return {
          sourceCodeId: globalIndex + 1,
          sourceCodeName: generateSourceCodeName(
            globalIndex,
            keyword,
            sort,
            order,
          ),
          gitUrl: generateGitUrl(globalIndex, sourceCodeType),
          mountPath: generateMountPath(globalIndex),
          sourceCodeType,
          executionCmd: generateExecutionCmd(globalIndex),
          createdAt: generateCreatedAt(globalIndex, sort, order),
          isPublic: globalIndex % 3 !== 0,
          creatorName: `사용자-${(globalIndex % 10) + 1}`,
          entityId: globalIndex + 1,
          creatorId: String((globalIndex % 10) + 1),
        };
      },
    );

    // 총 데이터 개수 (3페이지 분량으로 가정)
    const totalSize = pageSize * 3;

    return {
      status,
      message,
      timestamp,
      data: {
        totalSize,
        totalPageNum: Math.ceil(totalSize / pageSize),
        currentPageNo: pageNo,
        content,
      },
    };
  }),
];
