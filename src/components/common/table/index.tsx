import type { ResponsiveColumnType } from "xiilab-ui";
import { Table } from "xiilab-ui";

/**
 * 테이블 컴포넌트의 Props 인터페이스
 */
interface MyTableProps {
  /** 테이블 컬럼 정의 배열 */
  columns: ResponsiveColumnType[];
  /** 테이블에 표시할 데이터 배열 */
  data: any[];
}

/**
 * 재사용 가능한 테이블 컴포넌트
 *
 * xiilab-ui의 FlexibleTable을 래핑하여 일관된 테이블 스타일과 동작을 제공합니다.
 *
 * @param columns - 테이블 컬럼 정의 (FlexibleColumn 타입)
 * @param data - 테이블에 표시할 데이터 배열
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', title: '이름' },
 *   { key: 'age', title: '나이' }
 * ];
 *
 * const data = [
 *   { name: '홍길동', age: 30 },
 *   { name: '김철수', age: 25 }
 * ];
 *
 * <MyTable columns={columns} data={data} />
 * ```
 */
export function MyTable({ columns, data }: MyTableProps) {
  // FlexibleTable 컴포넌트를 사용하여 데이터를 렌더링
  return <Table columns={columns} dataSource={data} pagination={false} />;
}

