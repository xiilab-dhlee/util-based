"use client";

import { Col, Row } from "antd";

import type { GpuInstanceNode, GpuInstanceRow } from "@/types/node/node.type";
import { GpuInstance } from "./gpu-instance";

const gutter: [number, number] = [4, 4];

/**
 * GenerateGpuInstance 컴포넌트 Props
 */
interface GenerateGpuInstanceProps {
  /** 행 구성 배열 */
  rows: GpuInstanceRow[];
}

/**
 * 동적으로 Row와 Col을 구성하는 GPU 인스턴스 컴포넌트
 */
export function GenerateGpuInstance({ rows }: GenerateGpuInstanceProps) {
  /**
   * 노드를 렌더링하는 함수
   */
  const renderNodeElement = (node: GpuInstanceNode) => {
    if (node.type === "node") {
      return <GpuInstance key={node.gpuIndex} {...node} />;
    }

    return null;
  };

  /**
   * 행을 렌더링하는 함수
   */
  const renderRow = (row: GpuInstanceRow, rowIndex: number) => {
    return (
      <Row key={rowIndex} gutter={gutter} style={{ height: row.height }}>
        {row.nodes.map((node) => {
          if (node.type === "node") {
            // 단일 노드인 경우 span 계산
            const span = 24 / row.nodes.length;
            return (
              <Col key={node.name} span={span}>
                {renderNodeElement(node)}
              </Col>
            );
          }

          if (node.type === "column" && node.children) {
            // 컬럼인 경우 자식들을 처리
            const span = 24 / row.nodes.length;
            return (
              <Col key={node.name} span={span}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: gutter[1],
                  }}
                >
                  {node.children.map((child) => {
                    if (child.type === "node") {
                      return (
                        <div key={child.name} style={{ height: "50%" }}>
                          {renderNodeElement(child)}
                        </div>
                      );
                    }

                    if (child.type === "column" && child.children) {
                      return (
                        <Row
                          key={child.name}
                          gutter={gutter}
                          style={{ height: "50%" }}
                        >
                          {child.children.map((grandChild) => (
                            <Col
                              key={grandChild.name}
                              span={24 / child.children!.length}
                            >
                              {renderNodeElement(grandChild)}
                            </Col>
                          ))}
                        </Row>
                      );
                    }

                    return null;
                  })}
                </div>
              </Col>
            );
          }

          return null;
        })}
      </Row>
    );
  };

  return rows.map((row, rowIndex) => renderRow(row, rowIndex));
}
