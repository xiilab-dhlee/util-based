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

<!-- 새로운 협의 사항은 위의 구분선 아래에 추가하세요 -->
