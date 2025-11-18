"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * 인증 에러 페이지
 * NextAuth.js에서 발생하는 인증 오류를 처리합니다.
 */
function AuthErrorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorParam = searchParams?.get("error");
    setError(errorParam || "Unknown error");
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "Configuration":
        return "서버 설정에 문제가 있습니다.";
      case "AccessDenied":
        return "접근이 거부되었습니다.";
      case "Verification":
        return "토큰 검증에 실패했습니다.";
      case "Default":
        return "인증 과정에서 오류가 발생했습니다.";
      case "Signin":
        return "로그인에 실패했습니다.";
      case "OAuthSignin":
        return "OAuth 로그인에 실패했습니다.";
      case "OAuthCallback":
        return "OAuth 콜백 처리에 실패했습니다.";
      case "OAuthCreateAccount":
        return "OAuth 계정 생성에 실패했습니다.";
      case "EmailCreateAccount":
        return "이메일 계정 생성에 실패했습니다.";
      case "Callback":
        return "콜백 처리에 실패했습니다.";
      case "OAuthAccountNotLinked":
        return "이미 다른 제공자로 연결된 계정입니다.";
      case "EmailSignin":
        return "이메일 로그인에 실패했습니다.";
      case "CredentialsSignin":
        return "자격 증명이 올바르지 않습니다.";
      case "SessionRequired":
        return "로그인이 필요합니다.";
      default:
        return `인증 오류가 발생했습니다: ${error}`;
    }
  };

  const handleRetry = () => {
    router.push("/signin");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
          textAlign: "center",
          maxWidth: "500px",
          margin: "0 1rem",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        >
          ⚠️
        </div>

        <h1
          style={{
            marginBottom: "1rem",
            color: "#d32f2f",
            fontSize: "1.5rem",
          }}
        >
          인증 오류
        </h1>

        <p
          style={{
            marginBottom: "2rem",
            color: "#666",
            lineHeight: "1.5",
          }}
        >
          {getErrorMessage(error)}
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleRetry}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#0051cc";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#0070f3";
            }}
          >
            다시 로그인
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#545b62";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
            }}
          >
            홈으로 가기
          </button>
        </div>

        {error && (
          <details
            style={{
              marginTop: "2rem",
              textAlign: "left",
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "4px",
              border: "1px solid #dee2e6",
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "#495057",
              }}
            >
              기술적 세부사항
            </summary>
            <pre
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "#6c757d",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              Error Code: {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return <AuthErrorPageContent />;
}
