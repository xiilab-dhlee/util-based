import type { ComponentType } from "react";

/**
 * 값이 undefined, null, 빈 문자열, 공백 문자열인 경우 '-'로 변환
 * @param value 입력 값
 * @returns 변환된 값
 */
const safeValue = (value: any): string => {
  if (value === null) return "-";
  const strValue = String(value).trim();
  if (strValue === "") return "-";
  return strValue;
};

/**
 * 모든 문자열 props를 자동으로 safeValue로 변환하는 HOC
 * @param WrappedComponent 원본 컴포넌트
 * @returns 변환된 props를 받는 컴포넌트
 */
export const withSafeProps = <P extends object>(
  WrappedComponent: ComponentType<P>,
  excludeProps: (keyof P)[] = [],
) => {
  const SafePropsComponent = (props: P) => {
    // props를 순회하며 safeValue로 변환
    const safeProps = Object.keys(props).reduce((acc, key) => {
      if (excludeProps.includes(key as keyof P)) {
        return { ...acc, [key]: props[key as keyof P] };
      }

      const value = props[key as keyof P];
      return {
        ...acc,
        [key]: typeof value === "string" ? safeValue(value) : value,
      };
    }, {} as P);

    return <WrappedComponent {...safeProps} />;
  };

  // 디스플레이 이름 설정
  SafePropsComponent.displayName = `WithSafeProps(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return SafePropsComponent;
};

