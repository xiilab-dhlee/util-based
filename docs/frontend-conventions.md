# 프론트엔드 개발 협의 사항

이 문서는 프론트엔드 개발 중 협의된 내용을 정리합니다.

---

## 컴포넌트 위치 관리

### 다중 도메인 사용 컴포넌트의 shared 이동

**협의일**: 2025-11-30

**상황**: 특정 도메인에서 생성된 컴포넌트가 다른 도메인에서도 import되어 사용되는 경우

**협의 내용**: 두 개 이상의 도메인에서 사용되는 컴포넌트는 `shared` 폴더에서 관리한다.

**적용 사례**: `WorkloadVolumeCard` 컴포넌트

- **이전 위치**: `src/domain/volume/components/workload-volume-card.tsx`
- **이동 위치**: `src/shared/components/card/workload-volume-card.tsx`
- **이동 사유**: `volume`, `workload` 등 여러 도메인에서 import되어 사용됨

**참고 파일**: [workload-volume-card.tsx](../src/shared/components/card/workload-volume-card.tsx)

**이유**:
- 도메인 간 의존성을 최소화하고 명확한 경계를 유지
- 공유 컴포넌트의 위치를 일관성 있게 관리
- 컴포넌트의 특성에 따라 적절한 하위 폴더에 배치 (예: Card 기반 컴포넌트는 `shared/components/card/`)

### 모달 컴포넌트 선언 위치

**협의일**: 2025-12-05

**상황**: 모달 컴포넌트의 선언 위치가 일관되지 않아 유지보수가 어려운 경우

**협의 내용**: 모달 컴포넌트(`*-modal.tsx` 또는 `*Modal`)는 항상 페이지의 Entry-Point에 선언해야 한다.

**규칙**:
1. **일반 모달**: 주로 해당 페이지의 Main 컴포넌트 최상단에 선언한다.
   - 예: `WorkloadListMain`에서 `CreateWorkloadModal` 선언
2. **공통 UI 모달**: 여러 페이지 간 공통으로 보여지는 UI를 정의하는 Layout에 선언한다.
   - 예: `WorkloadDetailLayout`
3. **전역 공통 모달**: 모든 페이지에서 사용되는 공통 모달의 경우 최상위 Layout(`ModeLayout`)에 선언한다.

**예시 코드**:

```tsx
// src/domain/workload/components/list/workload-list-main.tsx
import { CreateWorkloadModal } from "./create-workload-modal";

export const WorkloadListMain = () => {
  // ... 로직 ...

  return (
    <>
      <Container>
         {/* ... 리스트 UI ... */}
      </Container>
      
      {/* ✅ 모달은 컴포넌트 최상단(또는 최하단) Entry Point에 선언 */}
      <CreateWorkloadModal />
    </>
  );
};
```

**이유**:
- 모달의 상태 관리와 가시성 제어를 명확한 위치에서 수행
- 불필요한 렌더링 방지 및 구조 파악 용이
- React Portal 등을 사용할 때 예측 가능한 동작 보장

---

## Import 경로 규칙

### @/ Alias 사용

**협의일**: 2025-11-30

**상황**: 프로젝트 내에서 import 경로가 상대 경로(`../`, `./`)와 절대 경로(`@/`)가 혼용되어 일관성이 부족한 경우

**협의 내용**: 모든 import 경로는 `@/` alias를 사용하여 절대 경로로 작성한다.

**예시 코드**:

```typescript
// ❌ Bad - 상대 경로 사용
import { settingKeys } from "../constants/setting.key";
import { ManageParameter } from "./manage-parameter";
import type { VolumeListType } from "../../schemas/volume.schema";

// ✅ Good - @/ alias 사용
import { settingKeys } from "@/domain/setting/constants/setting.key";
import { ManageParameter } from "@/domain/sourcecode/components/manage-parameter";
import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
```

**예외 사항**:
- `index.ts` 파일에서 같은 폴더 내 모듈을 re-export하는 경우는 상대 경로 사용 가능

```typescript
// src/domain/group/components/detail-panel/index.ts
// ✅ 허용 - index.ts에서의 re-export
export { AccountDetailPanel } from "./account-detail-panel";
export { GroupDetailPanel } from "./group-detail-panel";
```

**이유**:
- 파일 이동 시 import 경로 수정 최소화
- 코드 가독성 향상 및 파일 위치 파악 용이
- 일관된 코드 스타일 유지

---

## 폼 관리 및 유효성 검사 규칙

### React Hook Form + Zod 사용

**협의일**: 2025-12-05

**상황**: 복잡한 폼 상태 관리 및 유효성 검사를 위해 일관된 패턴이 필요함

**협의 내용**: 폼 관리에는 `react-hook-form`을, 유효성 검사에는 `zod`와 `@hookform/resolvers/zod`를 사용한다.

**규칙**:
1. **라이브러리**: `react-hook-form`, `zod`, `@hookform/resolvers` 사용
2. **유효성 검사**: Zod 스키마를 정의하고 `zodResolver`를 통해 연결
3. **UI 연동**: `xiilab-ui`와 같은 Controlled Component는 `Controller` 컴포넌트를 사용하여 제어
4. **웹 접근성**: `FormItem`의 `htmlFor`와 입력 요소의 `id`는 문서 전체에서 유일한 값으로 설정하여 연결 (중복 방지)
5. **에러 표시**: `FormItem`의 `validateStatus`와 `help` prop을 사용하여 에러 상태 및 메시지 표시

**예시 코드**:

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormItem, Input } from "xiilab-ui";

// 1. Zod 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요."),
});

type FormType = z.infer<typeof formSchema>;

export function MyFormModal() {
  // 2. useForm 설정
  const { control, handleSubmit, formState: { errors } } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: FormType) => {
    // 제출 로직
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)}>
      {/* 3. Controller 사용 */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FormItem
            label="이름"
            required
            // 4. 웹 접근성 (유니크한 id 사용)
            htmlFor="unique-form-name"
            // 5. 에러 상태 및 메시지 표시
            validateStatus={errors.name ? "error" : undefined}
            help={errors.name?.message}
          >
            <Input 
              {...field} 
              id="unique-form-name" 
              placeholder="이름 입력" 
            />
          </FormItem>
        )}
      />
    </Form>
  );
}
```

**이유**:
- 폼 상태 관리의 복잡성 감소 및 렌더링 최적화
- 선언적인 유효성 검사 로직 (Zod)
- UI 라이브러리와의 원활한 통합 (Controller)
- 웹 접근성 준수 및 ID 충돌 방지
- 일관된 에러 처리 UX 제공

---

## 목록 페이지 컴포넌트 구조

### Main 컴포넌트에서 API 호출 및 Props 전달

**협의일**: 2025-12-09

**상황**: 목록 페이지에서 필터, 테이블, 페이지네이션 컴포넌트가 각각 API를 호출하거나 데이터를 공유하는 방식이 일관되지 않은 경우

**협의 내용**: 목록 페이지의 Main 컴포넌트에서 API를 호출하고, 하위 컴포넌트(Filter, Body, Footer)에 필요한 데이터를 props로 전달한다.

**규칙**:
1. **필터 상태**: 전역 상태(Jotai Atom)로 관리하여 URL 동기화 및 컴포넌트 간 공유
2. **API 호출**: Main 컴포넌트에서 단일 호출
3. **데이터 전달**: 하위 컴포넌트에 `content`, `total`, `loading` 등을 props로 전달
4. **Props 네이밍**:
   - 도메인 컴포넌트(Filter, Body, Footer)의 props: `loading`
   - 공유 컴포넌트(`ListPageFooter`)의 props: `isLoading`
   - Footer에서 `loading` → `isLoading`으로 매핑하여 전달
5. **컴포넌트 역할 분리**:
   - `*ListMain`: API 호출, 데이터 관리, 하위 컴포넌트 조합
   - `*ListFilter`: 필터 UI, 검색, 총 개수 표시
   - `*ListBody`: 테이블 렌더링
   - `*ListFooter`: 페이지네이션

**컴포넌트 구조**:

```
src/domain/{domain}/
├── components/
│   └── list/
│       ├── {domain}-list-main.tsx      # API 호출 및 데이터 관리
│       ├── {domain}-list-filter.tsx    # 필터 UI (props: total, loading)
│       ├── {domain}-list-body.tsx      # 테이블 (props: content, loading)
│       └── {domain}-list-footer.tsx    # 페이지네이션 (props: total, loading)
├── state/
│   └── {domain}.atom.ts                # 필터 상태 (page, searchText, etc.)
└── hooks/
    └── use-get-{domain}s.ts            # API 호출 훅
```

**예시 코드**:

```tsx
// src/domain/workload/components/list/workload-list-main.tsx
"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";

import { WorkloadListBody } from "@/domain/workload/components/list/workload-list-body";
import { WorkloadListFilter } from "@/domain/workload/components/list/workload-list-filter";
import { WorkloadListFooter } from "@/domain/workload/components/list/workload-list-footer";
import { useGetActiveWorkloads } from "@/domain/workload/hooks/use-get-active-workloads";
import {
  workloadJobTypeAtom,
  workloadPageAtom,
  workloadSearchTextAtom,
  workloadStatusAtom,
} from "@/domain/workload/state/workload.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

export function WorkloadListMain() {
  // 1. 전역 상태에서 필터 값 읽기
  const page = useAtomValue(workloadPageAtom);
  const searchText = useAtomValue(workloadSearchTextAtom);
  const jobType = useAtomValue(workloadJobTypeAtom);
  const status = useAtomValue(workloadStatusAtom);

  // 2. Main에서 API 호출
  const { data, isLoading } = useGetActiveWorkloads({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: isNull(status) ? undefined : status,
  });

  // 3. 하위 컴포넌트에 props 전달
  return (
    <>
      <WorkloadListFilter total={data?.totalSize || 0} loading={isLoading} />
      <WorkloadListBody content={data?.content || []} loading={isLoading} />
      <WorkloadListFooter total={data?.totalSize || 0} loading={isLoading} />
    </>
  );
}
```

```tsx
// src/domain/workload/components/list/workload-list-filter.tsx
interface WorkloadListFilterProps {
  total: number;
  loading: boolean;
}

export function WorkloadListFilter({ total, loading }: WorkloadListFilterProps) {
  // 필터 변경은 전역 상태를 직접 업데이트
  const { onSubmit } = useSearch(workloadSearchTextAtom);

  return (
    <MySearchFilter title="워크로드 목록" total={total}>
      <WorkloadJobTypeSort disabled={loading} />
      <WorkloadStatusSort disabled={loading} />
      <form onSubmit={onSubmit}>
        <SearchInput disabled={loading} />
      </form>
    </MySearchFilter>
  );
}
```

```tsx
// src/domain/workload/components/list/workload-list-body.tsx
interface WorkloadListBodyProps {
  content: ActiveWorkloadListType[];
  loading: boolean;
}

export function WorkloadListBody({ content, loading }: WorkloadListBodyProps) {
  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkloadColumn([/* ... */])}
        data={content}
        loading={loading}
      />
    </ListWrapper>
  );
}
```

```tsx
// src/domain/workload/components/list/workload-list-footer.tsx
interface WorkloadListFooterProps {
  total: number;
  loading: boolean;  // 도메인 컴포넌트는 loading 사용
}

export function WorkloadListFooter({ total, loading }: WorkloadListFooterProps) {
  // 페이지 변경은 전역 상태를 직접 업데이트
  const [page, setPage] = useAtom(workloadPageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}  // 공유 컴포넌트는 isLoading 사용 (매핑)
    />
  );
}
```

**데이터 흐름**:

```
┌─────────────────────────────────────────────────────────────┐
│                    WorkloadListMain                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  useAtomValue (필터 상태 읽기)                        │    │
│  │  - page, searchText, jobType, status                │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  useGetActiveWorkloads (API 호출)                    │    │
│  │  → { data, isLoading }                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐          │
│  │   Filter   │   │    Body    │   │   Footer   │          │
│  │ (total,    │   │ (content,  │   │ (total,    │          │
│  │  loading)  │   │  loading)  │   │  loading)  │          │
│  └────────────┘   └────────────┘   └────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

**이유**:
- **단일 API 호출**: 동일 데이터에 대한 중복 요청 방지
- **명확한 데이터 흐름**: 단방향 데이터 흐름으로 디버깅 용이
- **관심사 분리**: 각 컴포넌트는 UI 렌더링에만 집중
- **테스트 용이성**: 하위 컴포넌트는 props만 받아 렌더링하므로 테스트가 쉬움
- **로딩 상태 동기화**: 모든 하위 컴포넌트가 일관된 로딩 상태를 표시

**참고 파일**:
- [workload-list-main.tsx](../src/domain/workload/components/list/workload-list-main.tsx)
- [workload-list-filter.tsx](../src/domain/workload/components/list/workload-list-filter.tsx)
- [workload-list-body.tsx](../src/domain/workload/components/list/workload-list-body.tsx)
- [workload-list-footer.tsx](../src/domain/workload/components/list/workload-list-footer.tsx)

---

<!-- 새로운 협의 사항은 위의 구분선 아래에 추가하세요 -->
