/**
 * Redfish 서비스 메소드 데코레이터
 * Axios 인스턴스가 null이 아닌지 검증하는 데코레이터
 */

/**
 * Axios 인스턴스 연결 확인 데코레이터
 * @description 메소드 실행 전에 getAxios()가 null이 아닌지 확인합니다.
 * null인 경우 에러를 던집니다.
 * 검증 후 axios 인스턴스를 메소드의 첫 번째 인자로 주입합니다.
 */
export function RequireAxiosInstance(): MethodDecorator {
  return <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const originalMethod = descriptor.value as any;

    descriptor.value = function (this: any, ...args: any[]) {
      // getAxios 메소드가 있는지 확인
      if (typeof this.getAxios !== "function") {
        throw new Error(
          `${target.constructor.name}.${String(propertyKey)}: getAxios 메소드가 정의되어 있지 않습니다.`,
        );
      }

      // Axios 인스턴스 연결 확인
      const axiosInstance = this.getAxios();
      if (!axiosInstance) {
        throw new Error(
          `${target.constructor.name}.${String(propertyKey)}: axios 인스턴스가 연결되어 있지 않습니다.`,
        );
      }

      // axios 인스턴스를 첫 번째 인자로 주입하여 원래 메소드 실행
      return originalMethod.apply(this, args);
    } as any;
  };
}
