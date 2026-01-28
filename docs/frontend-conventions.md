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

### 모달 데이터 전달 방식

**협의일**: 2025-01-06

**상황**: 모달 열림/닫힘 상태 외에 추가 데이터가 필요한 경우 (예: 삭제할 항목 ID, 수정할 데이터 등)

**협의 내용**: 모달에 필요한 데이터는 props가 아닌 `useSubscribe` + PubSub 패턴을 사용하여 전달한다.

**규칙**:

1. **모달 상태 관리**: `useState`로 열림/닫힘 상태 관리
2. **데이터 전달**: `useSubscribe`로 PubSub 이벤트를 구독하여 데이터 수신
3. **데이터 저장**: 모달 내부에서 `useState`로 받은 데이터 저장
4. **모달 열기**: 데이터 수신 시 `setOpen(true)` 호출

**표준 패턴**:

```tsx
// ✅ Good - PubSub 패턴으로 데이터 전달

// 1. PubSub 이벤트 정의
// src/shared/constants/pubsub.constant.ts
export const ACCOUNT_EVENTS = {
  sendResetPassword: "account.sendResetPassword",
  showResetPasswordResult: "account.showResetPasswordResult",
} as const;

// 2. 모달 컴포넌트 - useSubscribe로 데이터 수신
// src/domain/account-management/components/list/confirm-reset-password-modal.tsx
"use client";

import { useState } from "react";
import { Modal } from "xiilab-ui";

import type { AccountItemResponse } from "@/api/generated/schemas";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function ConfirmResetPasswordModal() {
  // ✅ 모달 상태 관리
  const [open, setOpen] = useState(false);
  
  // ✅ 필요한 데이터를 로컬 상태로 관리
  const [account, setAccount] = useState<AccountItemResponse | null>(null);

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    if (!account) return;
    // account 데이터를 사용한 비즈니스 로직
    console.log("Reset password for:", account.accountId);
    handleClose();
  };

  // ✅ PubSub으로 데이터 수신 및 모달 열기
  useSubscribe(
    ACCOUNT_EVENTS.sendResetPassword,
    (accountData: AccountItemResponse) => {
      setAccount(accountData);  // 데이터 저장
      setOpen(true);            // 모달 열기
    },
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onOk={handleConfirm}
      title="패스워드 초기화"
    >
      패스워드는 랜덤으로 생성됩니다. <br />
      사용자 패스워드를 초기화 하겠습니까?
    </Modal>
  );
}

// 4. 부모 컴포넌트 - PubSub으로 데이터 전달
// src/domain/account-management/components/list/account-list-main.tsx
"use client";

import { Button } from "xiilab-ui";

import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { pubsubUtil } from "@/shared/utils/pubsub.util";
import { ConfirmResetPasswordModal } from "./confirm-reset-password-modal";

export function AccountListMain() {
  const handleResetPassword = (account: AccountItemResponse) => {
    // ✅ PubSub으로 데이터 전달 (모달이 자동으로 열림)
    pubsubUtil.publish(ACCOUNT_EVENTS.sendResetPassword, account);
  };

  return (
    <>
      <div>
        <Button onClick={() => handleResetPassword(accountData)}>
          패스워드 초기화
        </Button>
        {/* 리스트 UI */}
      </div>
      
      {/* ✅ props 없이 모달 선언 */}
      <ConfirmResetPasswordModal />
    </>
  );
}
```

```tsx
// ❌ Bad - props로 데이터 전달 (안티패턴)

// 잘못된 예시: props로 데이터 전달
interface ConfirmResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  account: AccountItemResponse;  // ❌ props로 데이터 받음
}

export function ConfirmResetPasswordModal({ 
  open, 
  onClose, 
  account 
}: ConfirmResetPasswordModalProps) {
  return (
    <Modal open={open} onCancel={onClose}>
      {/* ... */}
    </Modal>
  );
}

// 부모에서 상태 관리
export function AccountListMain() {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const handleResetPassword = (account) => {
    setSelectedAccount(account);  // ❌
    setOpen(true);                // ❌
  };
  
  return (
    <>
      <Button onClick={() => handleResetPassword(account)}>초기화</Button>
      <ConfirmResetPasswordModal 
        open={open} 
        onClose={() => setOpen(false)}
        account={selectedAccount}  // ❌ props로 전달
      />
    </>
  );
}
```

**모범 사례**:
- `ConfirmResetPasswordModal` - PubSub으로 계정 데이터 수신 후 패스워드 초기화
- `DeleteWorkloadModal` - PubSub으로 워크로드 ID 수신 후 삭제
- `ViewVulnerabilityModal` - PubSub으로 취약점 목록 수신 후 표시

**이유**:
- **단일 책임**: 모달은 자신의 상태와 데이터 관리에만 집중
- **결합도 감소**: 부모 컴포넌트와 모달 간 직접적인 의존성 제거
- **재사용성**: 어디서든 PubSub 이벤트만 발행하면 모달 사용 가능
- **테스트 용이성**: PubSub 이벤트만 mock하면 모달 테스트 가능
- **일관성**: 모든 모달이 동일한 패턴으로 데이터 수신

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

```text
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

## JSX 코딩 규칙

### 인라인 함수 사용 금지

**협의일**: 2025-01-06

**상황**: JSX 내에서 인라인 함수(화살표 함수, 익명 함수)를 직접 정의하여 이벤트 핸들러나 콜백으로 전달하는 경우

**협의 내용**: JSX 내에서 인라인 함수를 직접 정의하여 사용하는 것을 금지한다. 모든 함수는 컴포넌트 본문에서 미리 정의하거나 `useCallback`으로 메모이제이션하여 사용한다.

**규칙**:
1. **이벤트 핸들러**: 컴포넌트 본문에서 함수를 정의한 후 참조로 전달
2. **콜백 함수**: 필요시 `useCallback`으로 메모이제이션
3. **단순 값 전달**: 인라인 함수 대신 별도 핸들러 함수 정의

**예시 코드**:

```tsx
// ❌ Bad - JSX 내 인라인 함수 사용
export function MyComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  return (
    <div>
      {/* ❌ 인라인 화살표 함수 */}
      <button onClick={() => setCount(count + 1)}>증가</button>

      {/* ❌ 인라인 함수로 값 전달 */}
      <button onClick={() => handleDelete(item.id)}>삭제</button>

      {/* ❌ 인라인 함수로 조건부 로직 */}
      <input onChange={(e) => {
        if (e.target.value.length > 10) {
          setError("너무 깁니다");
        }
        setValue(e.target.value);
      }} />

      {/* ❌ map 내부 인라인 함수 */}
      {items.map((item) => (
        <Item key={item} onRemove={() => removeItem(item)} />
      ))}
    </div>
  );
}

// ✅ Good - 함수를 미리 정의하여 참조로 전달
export function MyComponent() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<string[]>([]);

  // 이벤트 핸들러 정의
  const handleIncrement = () => {
    setCount(count + 1);
  };

  // ID를 받는 핸들러는 useCallback 사용
  const handleDelete = useCallback((id: string) => {
    // 삭제 로직
  }, []);

  // 복잡한 로직은 별도 함수로 분리
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 10) {
      setError("너무 깁니다");
    }
    setValue(e.target.value);
  };

  // map 내부에서 사용할 핸들러
  const handleRemoveItem = useCallback((item: string) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, []);

  return (
    <div>
      <button onClick={handleIncrement}>증가</button>
      <button onClick={handleDelete}>삭제</button>
      <input onChange={handleInputChange} />
      {items.map((item) => (
        <ItemWithHandler
          key={item}
          item={item}
          onRemove={handleRemoveItem}
        />
      ))}
    </div>
  );
}

// 자식 컴포넌트에서 핸들러 호출
function ItemWithHandler({
  item,
  onRemove
}: {
  item: string;
  onRemove: (item: string) => void;
}) {
  const handleClick = () => {
    onRemove(item);
  };

  return <button onClick={handleClick}>Remove {item}</button>;
}
```

**예외 사항**:
- 테스트 코드에서는 간결성을 위해 인라인 함수 사용 허용
- 일회성 프로토타입 코드에서는 허용 (단, 프로덕션 전 리팩토링 필요)

**이유**:
- **성능 최적화**: 매 렌더링마다 새로운 함수가 생성되어 불필요한 리렌더링 유발 방지
- **코드 가독성**: 핸들러 로직이 JSX와 분리되어 컴포넌트 구조 파악 용이
- **테스트 용이성**: 명명된 함수는 단위 테스트 작성이 쉬움
- **디버깅 편의**: 스택 트레이스에서 함수명이 표시되어 디버깅 용이
- **메모이제이션 활용**: `React.memo`, `useCallback`과 함께 사용하여 최적화 가능

**참고**: `useCallback`의 과도한 사용은 오히려 성능에 악영향을 줄 수 있으므로, 실제로 메모이제이션이 필요한 경우(자식 컴포넌트에 props로 전달, 의존성 배열에 포함 등)에만 사용한다.

---

<!-- 새로운 협의 사항은 위의 구분선 아래에 추가하세요 -->
