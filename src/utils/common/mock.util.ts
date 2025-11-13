import { generateMock } from "@anatine/zod-mock";
import { faker } from "@faker-js/faker";
import type { ZodTypeAny } from "zod";

// stringMap: z.string() 타입의 특정 키에 대한 mock 데이터 생성 함수
// stringMap은 최우선순위로 처리되어 z.string().datetime() 같은 타입도 오버라이드 가능
const stringMap: Record<string, () => string> = {
  // 날짜 관련
  creatorDate: () => faker.date.past({ years: 10 }).toISOString(),
  creatorDateTime: () => faker.date.past({ years: 10 }).toISOString(),
  elapsedTime: () => faker.date.past({ years: 10 }).toISOString(),

  // URL 및 네트워크
  url: () => faker.internet.url(),
  ip: () => faker.internet.ipv4(),

  // 경로
  path: () => faker.system.filePath(),
  defaultPath: () => faker.system.directoryPath(),
  mountPath: () => faker.system.directoryPath(),

  // 명령어
  cmd: () => faker.hacker.verb(),

  // 이름
  name: () => faker.internet.displayName(),
  group: () => faker.company.name(),
  title: () => faker.internet.displayName(),
  workloadName: () => faker.internet.displayName(),
  workspaceName: () => faker.internet.displayName(),
  // 라벨
  labels: () => faker.internet.displayName(),
  creatorName: () => faker.internet.displayName(),

  // 이메일
  email: () => faker.internet.email(),

  // GPU 모델명
  modelName: () => faker.vehicle.manufacturer(),

  // 메시지
  message: () => faker.internet.password({ length: 100 }),
  requestReason: () => faker.internet.password({ length: 100 }),
  rejectReason: () => faker.internet.password({ length: 100 }),
};

// zod schema 기반으로 mock 데이터 생성
export function makeMock<T extends ZodTypeAny>(schema: T) {
  const mock = generateMock(schema, {
    stringMap,
  });

  return mock;
}
