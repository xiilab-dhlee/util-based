"use client";

import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";
import styled from "styled-components";

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Required ReactNode to render wrapped content */
  children: ReactNode;
  /** Optional ReactNode shown on error */
  fallback?: ReactNode;
  /** Optional callback receiving Error and ErrorInfo called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * React Error Boundary 컴포넌트
 *
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하고,
 * 에러 로그를 기록하며, 대체 UI를 보여주는 컴포넌트입니다.
 *
 * @features
 * - 컴포넌트 트리 어디서든 발생하는 에러 포착
 * - 사용자 친화적인 에러 UI 제공
 * - 에러 정보 로깅 및 외부 콜백 지원
 * - 커스텀 fallback UI 지원
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 정보를 외부 서비스에 로깅할 수 있습니다.
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 외부 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback UI가 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>문제가 발생했습니다</ErrorTitle>
            <ErrorMessage>
              페이지를 로드하는 중에 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </ErrorMessage>
            <ErrorActions>
              <RetryButton onClick={this.handleRetry}>다시 시도</RetryButton>
              <HomeButton onClick={() => (window.location.href = "/")}>
                홈으로 가기
              </HomeButton>
            </ErrorActions>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <ErrorDetails>
                <summary>에러 상세 정보 (개발 모드)</summary>
                <ErrorCode>{this.state.error.message}</ErrorCode>
                <ErrorStack>{this.state.error.stack}</ErrorStack>
              </ErrorDetails>
            )}
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}


// Styled Components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 2rem;
  font-family: system-ui, sans-serif;
`;

const ErrorContent = styled.div`
  max-width: 500px;
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e4e7;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #d32f2f;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.5;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051cc;
  }
`;

const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #545b62;
  }
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  text-align: left;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;

  summary {
    cursor: pointer;
    font-weight: bold;
    color: #495057;
    margin-bottom: 0.5rem;
  }
`;

const ErrorCode = styled.pre`
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: #d32f2f;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  overflow-x: auto;
`;

const ErrorStack = styled.pre`
  margin: 0.5rem 0 0 0;
  font-size: 0.75rem;
  color: #6c757d;
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #d1ecf1;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
`;
