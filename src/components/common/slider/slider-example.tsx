"use client";

import React, { useState } from "react";
import { Card, Typography, Space, Row, Col, Tag } from "antd";
import Slider from "./custom-slider";

const { Title, Paragraph, Text } = Typography;

/**
 * Slider 컴포넌트 예제 및 데모
 *
 * 핵심 Slider 사용 예시와 설정을 보여주는 인터랙티브 데모입니다.
 * Figma 디자인 시스템을 기반으로 구현되었습니다.
 */
const SliderExample = () => {
  // 핵심 슬라이더 상태 관리
  const [basicValue, setBasicValue] = useState<number>(25);
  const [stepValue, setStepValue] = useState<number>(20);
  const [disabledValue, setDisabledValue] = useState<number>(30);
  const [readModeValue, setReadModeValue] = useState<number>(60);

  // 색상 타입별 상태 관리
  const [gpuValue, setGpuValue] = useState<number>(80);
  const [cpuValue, setCpuValue] = useState<number>(65);
  const [memoryValue, setMemoryValue] = useState<number>(45);

  // 공통 카드 스타일
  const cardStyle = {
    borderRadius: "8px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    marginBottom: "16px",
  };

  // 공통 타이틀 스타일
  const titleStyle = {
    color: "#262626",
    marginBottom: "8px",
  };

  // 공통 단락 스타일
  const paragraphStyle = {
    color: "#595959",
    marginBottom: "24px",
  };

  return (
    <div style={{ width: "100%" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* 기본 슬라이더 */}
        <Card style={cardStyle}>
          <Title level={4} style={titleStyle}>
            기본 슬라이더 <Tag color="blue">기본</Tag>
          </Title>
          <Paragraph style={paragraphStyle}>
            가장 기본적인 슬라이더입니다. 0-100 범위에서 1씩 증감할 수 있습니다.
          </Paragraph>
          <Row gutter={[24, 16]} align="middle">
            <Col span={18}>
              <Slider
                value={basicValue}
                onChange={setBasicValue}
                width={404}
                type="gpu"
                aria-label="기본 슬라이더"
              />
            </Col>
          </Row>
        </Card>

        {/* 스텝 설정 슬라이더 */}
        <Card style={cardStyle}>
          <Title level={4} style={titleStyle}>
            스텝 설정 슬라이더 <Tag color="orange">스텝</Tag>
          </Title>
          <Paragraph style={paragraphStyle}>
            증감 단위를 10으로 설정한 슬라이더입니다. 0, 10, 20, 30... 형태로
            값이 변경됩니다.
          </Paragraph>
          <Row gutter={[24, 16]} align="middle">
            <Col span={18}>
              <Slider
                value={stepValue}
                min={0}
                max={100}
                step={10}
                width={404}
                type="cpu"
                onChange={setStepValue}
                aria-label="스텝 설정 슬라이더"
              />
            </Col>
          </Row>
        </Card>

        {/* 비활성화된 슬라이더 */}
        <Card style={cardStyle}>
          <Title level={4} style={titleStyle}>
            비활성화된 슬라이더 <Tag color="red">비활성</Tag>
          </Title>
          <Paragraph style={paragraphStyle}>
            사용자 상호작용이 불가능한 비활성화된 슬라이더입니다.
          </Paragraph>
          <Row gutter={[24, 16]} align="middle">
            <Col span={18}>
              <Slider
                value={disabledValue}
                disabled={true}
                width={404}
                type="memory"
                onChange={setDisabledValue}
                aria-label="비활성화된 슬라이더"
              />
            </Col>
          </Row>
        </Card>

        {/* 읽기 모드 슬라이더 */}
        <Card style={cardStyle}>
          <Title level={4} style={titleStyle}>
            읽기 모드 슬라이더 <Tag color="magenta">읽기모드</Tag>
          </Title>
          <Paragraph style={paragraphStyle}>
            완전한 읽기 전용 모드입니다. 버튼, divider, handle이 숨겨지고
            슬라이더 트랙 색상만 표시됩니다. InputNumber는 비활성화됩니다.
          </Paragraph>
          <Row gutter={[24, 16]} align="middle">
            <Col span={18}>
              <Slider
                value={readModeValue}
                readMode={true}
                width={404}
                type="cpu"
                onChange={setReadModeValue}
                aria-label="읽기 모드 슬라이더"
              />
            </Col>
          </Row>
        </Card>

        {/* 색상 타입별 슬라이더 */}
        <Card style={cardStyle}>
          <Title level={4} style={titleStyle}>
            🎨 색상 타입별 슬라이더 <Tag color="purple">색상</Tag>
          </Title>
          <Paragraph style={paragraphStyle}>
            GPU, CPU, Memory 각각의 용도에 맞는 색상으로 구분된 슬라이더입니다.
          </Paragraph>

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* GPU 슬라이더 */}
            <Row gutter={[24, 16]} align="middle">
              <Col span={18}>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong style={{ color: "#722ED1" }}>
                    GPU 사용률 <Tag color="purple">Purple</Tag>
                  </Text>
                </div>
                <Slider
                  value={gpuValue}
                  type="gpu"
                  onChange={setGpuValue}
                  aria-label="GPU 사용률 슬라이더"
                />
              </Col>
            </Row>

            {/* CPU 슬라이더 */}
            <Row gutter={[24, 16]} align="middle">
              <Col span={18}>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong style={{ color: "#1890FF" }}>
                    CPU 사용률 <Tag color="blue">Blue</Tag>
                  </Text>
                </div>
                <Slider
                  value={cpuValue}
                  type="cpu"
                  onChange={setCpuValue}
                  aria-label="CPU 사용률 슬라이더"
                />
              </Col>
            </Row>

            {/* Memory 슬라이더 */}
            <Row gutter={[24, 16]} align="middle">
              <Col span={18}>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong style={{ color: "#52C41A" }}>
                    메모리 사용률 <Tag color="green">Green</Tag>
                  </Text>
                </div>
                <Slider
                  value={memoryValue}
                  type="memory"
                  onChange={setMemoryValue}
                  aria-label="메모리 사용률 슬라이더"
                />
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 읽기 모드 비교 예제 */}
        <Card
          style={{
            ...cardStyle,
            background: "linear-gradient(135deg, #fff7e6 0%, #ffffff 100%)",
            border: "1px solid #ffd666",
          }}
        >
          <Title level={4} style={{ color: "#d48806", marginBottom: "16px" }}>
            🔍 읽기 모드 vs 일반 모드 비교
          </Title>
          <Paragraph style={paragraphStyle}>
            동일한 값(75)을 가진 슬라이더의 일반 모드와 읽기 모드를
            비교해보세요.
          </Paragraph>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* 일반 모드 */}
            <div>
              <Text
                strong
                style={{
                  color: "#262626",
                  fontSize: "16px",
                  marginBottom: "12px",
                  display: "block",
                }}
              >
                일반 모드 <Tag color="blue">상호작용 가능</Tag>
              </Text>
              <Slider
                value={75}
                type="memory"
                width={404}
                aria-label="일반 모드 슬라이더"
              />
            </div>

            {/* 읽기 모드 */}
            <div>
              <Text
                strong
                style={{
                  color: "#262626",
                  fontSize: "16px",
                  marginBottom: "12px",
                  display: "block",
                }}
              >
                읽기 모드 <Tag color="magenta">시각적 표시만</Tag>
              </Text>
              <Slider
                value={75}
                readMode={true}
                type="memory"
                width={404}
                aria-label="읽기 모드 슬라이더"
              />
            </div>
          </Space>
        </Card>

        {/* 사용법 가이드 */}
        <Card
          style={{
            ...cardStyle,
            background: "linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)",
            border: "1px solid #e6f7ff",
          }}
        >
          <Title level={4} style={{ color: "#1890ff", marginBottom: "16px" }}>
            📚 주요 Props
          </Title>
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Text strong style={{ color: "#262626", fontSize: "16px" }}>
                기본 설정:
              </Text>
              <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                <li>
                  <Text code>value</Text>: 현재 값
                </li>
                <li>
                  <Text code>min/max</Text>: 최소/최대값
                </li>
                <li>
                  <Text code>step</Text>: 증감 단위
                </li>
                <li>
                  <Text code>onChange</Text>: 값 변경 콜백
                </li>
                <li>
                  <Text code>disabled</Text>: 비활성화
                </li>
                <li>
                  <Text code>readOnly</Text>: 입력 필드만 읽기 전용
                </li>
                <li>
                  <Text code style={{ color: "#d48806" }}>
                    readMode
                  </Text>
                  : 완전 읽기 모드 <Tag color="orange">NEW</Tag>
                </li>
              </ul>
            </Col>

            <Col span={12}>
              <Text strong style={{ color: "#262626", fontSize: "16px" }}>
                색상 & UI:
              </Text>
              <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
                <li>
                  <Text code>type</Text>: gpu/cpu/memory
                </li>
                <li>
                  <Text code>width</Text>: 전체 너비 (기본: 404px)
                </li>
                <li>
                  <Text code>showInput</Text>: 입력 필드 표시
                </li>
                <li>
                  <Text code>aria-label</Text>: 접근성 라벨
                </li>
              </ul>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f6ffed",
                  borderRadius: "6px",
                }}
              >
                <Text style={{ color: "#389e0d", fontSize: "12px" }}>
                  🎨 <strong>색상:</strong> GPU(보라), CPU(파랑), Memory(초록)
                </Text>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "#fff7e6",
                  borderRadius: "6px",
                }}
              >
                <Text style={{ color: "#d48806", fontSize: "12px" }}>
                  ✨ <strong>읽기 모드:</strong> 버튼, divider, handle 숨김,
                  트랙 색상만 표시, InputNumber 비활성화
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default SliderExample;
