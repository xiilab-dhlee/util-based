#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Allure 성능 분석기
 *
 * 기능:
 * A. 히스토리 기반 시간 추이 분석
 * B. 느린 테스트 Top 10 식별
 * E. 성능 회귀 감지 (20% 임계값)
 *
 * 사용법:
 *   node scripts/allure-performance-analyzer.mjs
 *
 * 환경변수:
 *   PERF_REGRESSION_THRESHOLD: 성능 회귀 임계값 (기본: 0.2 = 20%)
 *   SLOW_TEST_TOP_N: 느린 테스트 표시 개수 (기본: 10)
 */

// ============================================================================
// 설정
// ============================================================================

const CONFIG = {
  // 성능 회귀 임계값 (20% = 0.2)
  regressionThreshold: Number(process.env.PERF_REGRESSION_THRESHOLD) || 0.2,
  // 느린 테스트 Top N
  slowTestTopN: Number(process.env.SLOW_TEST_TOP_N) || 10,
  // 경로
  allureResultsDir: join(process.cwd(), "allure-results"),
  allureReportDir: join(process.cwd(), "allure-report"),
  historyFile: join(process.cwd(), "allure-report", "history", "history.json"),
  outputFile: join(process.cwd(), "allure-results", "performance-analysis.json"),
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 밀리초를 읽기 쉬운 형식으로 변환
 */
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

/**
 * 변화율 계산 (퍼센트)
 */
function calculateChangePercent(current, previous) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Allure 결과 파일 읽기
 */
function readAllureResults() {
  const resultsDir = CONFIG.allureResultsDir;

  if (!existsSync(resultsDir)) {
    console.error("❌ allure-results 디렉토리가 없습니다.");
    return [];
  }

  const files = readdirSync(resultsDir).filter((f) => f.endsWith("-result.json"));
  const results = [];

  for (const file of files) {
    try {
      const content = readFileSync(join(resultsDir, file), "utf-8");
      const data = JSON.parse(content);

      // start/stop 필드에서 duration 계산
      if (data.start && data.stop && !data.time) {
        data.time = {
          start: data.start,
          stop: data.stop,
          duration: data.stop - data.start,
        };
      }

      results.push(data);
    } catch {
      // JSON 파싱 실패 시 무시
    }
  }

  return results;
}

/**
 * 히스토리 데이터 읽기
 */
function readHistory() {
  if (!existsSync(CONFIG.historyFile)) {
    return {};
  }

  try {
    const content = readFileSync(CONFIG.historyFile, "utf-8");
    const historyArray = JSON.parse(content);

    // 배열을 testId 기반 맵으로 변환
    const historyMap = {};
    for (const item of historyArray) {
      if (item.id && item.time && item.time.duration !== undefined) {
        historyMap[item.id] = {
          duration: item.time.duration,
          status: item.status,
          name: item.name,
        };
      }
    }
    return historyMap;
  } catch {
    return {};
  }
}

// ============================================================================
// 분석 함수
// ============================================================================

/**
 * A. 시나리오별 실행 시간 추이 분석
 */
function analyzeTimeTrend(currentResults, history) {
  const trends = [];

  for (const result of currentResults) {
    const testId = result.historyId || result.uuid;
    const currentDuration = result.time?.duration || 0;
    const previousData = history[testId];

    const trend = {
      name: result.name || "Unknown",
      fullName: result.fullName || result.name,
      currentDuration,
      currentDurationFormatted: formatDuration(currentDuration),
      status: result.status,
    };

    if (previousData) {
      const previousDuration = previousData.duration;
      const changePercent = calculateChangePercent(currentDuration, previousDuration);

      trend.previousDuration = previousDuration;
      trend.previousDurationFormatted = formatDuration(previousDuration);
      trend.changePercent = Math.round(changePercent * 100) / 100;
      trend.changeDirection =
        changePercent > 5 ? "slower" : changePercent < -5 ? "faster" : "stable";
    } else {
      trend.changeDirection = "new";
    }

    trends.push(trend);
  }

  return trends.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
}

/**
 * B. 느린 테스트 Top N (상대값 기준)
 */
function findSlowTests(currentResults) {
  // 전체 테스트 평균 계산
  const durations = currentResults
    .filter((r) => r.time?.duration > 0)
    .map((r) => r.time.duration);

  if (durations.length === 0) {
    return { slowTests: [], stats: { average: 0, median: 0, threshold: 0 } };
  }

  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  const sorted = [...durations].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  // 상대값 기준: 평균의 2배 이상을 "느린 테스트"로 분류
  const threshold = average * 2;

  const slowTests = currentResults
    .filter((r) => r.time?.duration >= threshold)
    .map((r) => ({
      name: r.name || "Unknown",
      fullName: r.fullName || r.name,
      duration: r.time.duration,
      durationFormatted: formatDuration(r.time.duration),
      ratio: Math.round((r.time.duration / average) * 100) / 100, // 평균 대비 배율
      status: r.status,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, CONFIG.slowTestTopN);

  return {
    slowTests,
    stats: {
      average: Math.round(average),
      averageFormatted: formatDuration(Math.round(average)),
      median: Math.round(median),
      medianFormatted: formatDuration(Math.round(median)),
      threshold: Math.round(threshold),
      thresholdFormatted: formatDuration(Math.round(threshold)),
      totalTests: durations.length,
    },
  };
}

/**
 * E. 성능 회귀 감지 (20% 이상 느려진 테스트)
 */
function detectRegressions(trends) {
  const thresholdPercent = CONFIG.regressionThreshold * 100; // 20%

  const regressions = trends
    .filter(
      (t) =>
        t.changePercent !== undefined &&
        t.changePercent >= thresholdPercent &&
        t.status !== "skipped"
    )
    .map((t) => ({
      name: t.name,
      fullName: t.fullName,
      currentDuration: t.currentDuration,
      currentDurationFormatted: t.currentDurationFormatted,
      previousDuration: t.previousDuration,
      previousDurationFormatted: t.previousDurationFormatted,
      regressionPercent: t.changePercent,
      severity:
        t.changePercent >= 100 ? "critical" : t.changePercent >= 50 ? "high" : "medium",
    }));

  return regressions;
}

/**
 * 전체 실행 통계 계산
 */
function calculateOverallStats(currentResults) {
  const durations = currentResults
    .filter((r) => r.time?.duration > 0)
    .map((r) => r.time.duration);

  if (durations.length === 0) {
    return {
      totalDuration: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      totalTests: 0,
    };
  }

  const totalDuration = durations.reduce((a, b) => a + b, 0);
  const averageDuration = totalDuration / durations.length;

  return {
    totalDuration,
    totalDurationFormatted: formatDuration(totalDuration),
    averageDuration: Math.round(averageDuration),
    averageDurationFormatted: formatDuration(Math.round(averageDuration)),
    minDuration: Math.min(...durations),
    minDurationFormatted: formatDuration(Math.min(...durations)),
    maxDuration: Math.max(...durations),
    maxDurationFormatted: formatDuration(Math.max(...durations)),
    totalTests: durations.length,
    passedTests: currentResults.filter((r) => r.status === "passed").length,
    failedTests: currentResults.filter((r) => r.status === "failed").length,
    brokenTests: currentResults.filter((r) => r.status === "broken").length,
    skippedTests: currentResults.filter((r) => r.status === "skipped").length,
  };
}

// ============================================================================
// Allure 환경 정보 생성
// ============================================================================

/**
 * Allure environment.properties 생성
 */
function generateEnvironmentInfo(stats, regressions, slowTests) {
  const envContent = [
    `Total_Tests=${stats.totalTests}`,
    `Passed_Tests=${stats.passedTests}`,
    `Failed_Tests=${stats.failedTests}`,
    `Total_Duration=${stats.totalDurationFormatted}`,
    `Average_Duration=${stats.averageDurationFormatted}`,
    `Regression_Count=${regressions.length}`,
    `Slow_Tests_Count=${slowTests.slowTests.length}`,
    `Regression_Threshold=${CONFIG.regressionThreshold * 100}%`,
    `Slow_Test_Threshold=${slowTests.stats.thresholdFormatted || "N/A"}`,
    `Analysis_Timestamp=${new Date().toISOString()}`,
  ].join("\n");

  writeFileSync(join(CONFIG.allureResultsDir, "environment.properties"), envContent);
}

/**
 * 커스텀 위젯 JSON 생성 (느린 테스트 Top 5)
 * Allure 리포트의 widgets/ 디렉토리에 복사될 파일
 */
function generateCustomWidgets(slowTests, regressions, stats, currentResults) {
  // 느린 테스트 Top 5 위젯 데이터 (커스텀)
  const slowTestsWidget = {
    total: slowTests.slowTests.length,
    items: slowTests.slowTests.slice(0, 5).map((t, index) => ({
      uid: `slow-${index}`,
      name: t.name,
      time: {
        duration: t.duration,
        maxDuration: slowTests.slowTests[0]?.duration || t.duration,
      },
      status: t.status,
      extra: `${t.ratio}x avg`,
    })),
  };

  // 성능 회귀 위젯 데이터
  const regressionsWidget = {
    total: regressions.length,
    items: regressions.slice(0, 5).map((r, index) => ({
      uid: `regression-${index}`,
      name: r.name,
      time: {
        duration: r.currentDuration,
        previousDuration: r.previousDuration,
      },
      status: "warning",
      extra: `+${r.regressionPercent.toFixed(1)}%`,
      severity: r.severity,
    })),
  };

  // 성능 요약 위젯 데이터
  const performanceSummary = {
    statistic: {
      total: stats.totalTests,
      passed: stats.passedTests,
      failed: stats.failedTests,
      broken: stats.brokenTests,
      skipped: stats.skippedTests,
    },
    time: {
      total: stats.totalDuration,
      average: stats.averageDuration,
      min: stats.minDuration,
      max: stats.maxDuration,
    },
    performance: {
      slowTestsCount: slowTests.slowTests.length,
      slowTestsThreshold: slowTests.stats.threshold,
      regressionsCount: regressions.length,
      regressionThreshold: CONFIG.regressionThreshold * 100,
    },
  };

  // Allure 기본 duration.json 형식 - 느린 테스트 Top 5 (대시보드 Duration 위젯에 표시됨!)
  const durationWidget = slowTests.slowTests.slice(0, 5).map((t) => {
    // 원본 테스트 결과에서 uid 찾기
    const original = currentResults.find((r) => r.name === t.name);
    return {
      uid: original?.uuid || `slow-${t.name}`,
      name: `🐢 ${t.name}`,
      time: {
        start: original?.start || 0,
        stop: original?.stop || 0,
        duration: t.duration,
      },
      status: t.status,
      severity: "blocker", // 느린 테스트는 blocker로 표시
    };
  });

  // widgets 디렉토리 생성
  const widgetsDir = join(CONFIG.allureResultsDir, "widgets");
  if (!existsSync(widgetsDir)) {
    mkdirSync(widgetsDir, { recursive: true });
  }

  // widgets 디렉토리에 저장할 파일들
  writeFileSync(
    join(widgetsDir, "slow-tests.json"),
    JSON.stringify(slowTestsWidget, null, 2)
  );

  writeFileSync(
    join(widgetsDir, "regressions.json"),
    JSON.stringify(regressionsWidget, null, 2)
  );

  writeFileSync(
    join(widgetsDir, "performance-summary.json"),
    JSON.stringify(performanceSummary, null, 2)
  );

  // duration.json - 느린 테스트 Top 5만 표시 (대시보드 Duration 위젯)
  writeFileSync(
    join(widgetsDir, "duration.json"),
    JSON.stringify(durationWidget, null, 2)
  );
}

/**
 * Allure 커스텀 카테고리 생성 (느린 테스트, 성능 회귀)
 */
function generateCategories(regressions, slowTests) {
  const categories = [
    // 기존 카테고리 유지
    {
      name: "Timeout errors",
      matchedStatuses: ["broken"],
      messageRegex: ".*Timeout.*",
    },
    {
      name: "Element not found",
      matchedStatuses: ["broken"],
      messageRegex: ".*locator.*",
    },
  ];

  // 성능 회귀 카테고리
  if (regressions.length > 0) {
    categories.push({
      name: `⚠️ Performance Regressions (${regressions.length})`,
      matchedStatuses: ["passed", "failed", "broken"],
      messageRegex: ".*",
      description: `Tests that became ${CONFIG.regressionThreshold * 100}%+ slower`,
    });
  }

  // 느린 테스트 카테고리
  if (slowTests.slowTests.length > 0) {
    categories.push({
      name: `🐢 Slow Tests (>${slowTests.stats.thresholdFormatted})`,
      matchedStatuses: ["passed", "failed", "broken"],
      messageRegex: ".*",
      description: `Tests exceeding 2x average duration (${slowTests.stats.averageFormatted})`,
    });
  }

  writeFileSync(
    join(CONFIG.allureResultsDir, "categories.json"),
    JSON.stringify(categories, null, 2)
  );
}

// ============================================================================
// 콘솔 리포트 출력
// ============================================================================

function printReport(stats, trends, regressions, slowTests) {
  console.log("\n" + "=".repeat(70));
  console.log("📊 ALLURE PERFORMANCE ANALYSIS REPORT");
  console.log("=".repeat(70));

  // 전체 통계
  console.log("\n📈 Overall Statistics");
  console.log("-".repeat(40));
  console.log(`  Total Tests:     ${stats.totalTests}`);
  console.log(`  Total Duration:  ${stats.totalDurationFormatted}`);
  console.log(`  Average:         ${stats.averageDurationFormatted}`);
  console.log(`  Min/Max:         ${stats.minDurationFormatted} / ${stats.maxDurationFormatted}`);
  console.log(`  Pass Rate:       ${Math.round((stats.passedTests / stats.totalTests) * 100)}%`);

  // 성능 회귀 (E)
  console.log("\n⚠️  Performance Regressions (≥20% slower)");
  console.log("-".repeat(40));
  if (regressions.length === 0) {
    console.log("  ✅ No regressions detected!");
  } else {
    for (const r of regressions) {
      const severity =
        r.severity === "critical" ? "🔴" : r.severity === "high" ? "🟠" : "🟡";
      console.log(
        `  ${severity} ${r.name}`
      );
      console.log(
        `     ${r.previousDurationFormatted} → ${r.currentDurationFormatted} (+${r.regressionPercent.toFixed(1)}%)`
      );
    }
  }

  // 느린 테스트 Top 10 (B)
  console.log(`\n🐢 Slow Tests Top ${CONFIG.slowTestTopN} (>${slowTests.stats.thresholdFormatted})`);
  console.log("-".repeat(40));
  if (slowTests.slowTests.length === 0) {
    console.log("  ✅ No slow tests detected!");
  } else {
    for (let i = 0; i < slowTests.slowTests.length; i++) {
      const t = slowTests.slowTests[i];
      console.log(`  ${i + 1}. ${t.name}`);
      console.log(`     ${t.durationFormatted} (${t.ratio}x average)`);
    }
  }

  // 시간 추이 요약 (A)
  console.log("\n📉 Time Trend Summary");
  console.log("-".repeat(40));
  const faster = trends.filter((t) => t.changeDirection === "faster").length;
  const slower = trends.filter((t) => t.changeDirection === "slower").length;
  const stable = trends.filter((t) => t.changeDirection === "stable").length;
  const newTests = trends.filter((t) => t.changeDirection === "new").length;
  console.log(`  Faster: ${faster} | Slower: ${slower} | Stable: ${stable} | New: ${newTests}`);

  console.log("\n" + "=".repeat(70));
  console.log("📁 Results saved to: allure-results/performance-analysis.json");
  console.log("=".repeat(70) + "\n");
}

// ============================================================================
// 메인 실행
// ============================================================================

function main() {
  console.log("\n🔍 Analyzing Allure test results...\n");

  // 1. 데이터 수집
  const currentResults = readAllureResults();
  const history = readHistory();

  if (currentResults.length === 0) {
    console.log("⚠️  No test results found. Run tests first.");
    process.exit(0);
  }

  console.log(`📝 Found ${currentResults.length} test results`);
  console.log(`📚 Found ${Object.keys(history).length} history entries`);

  // 2. 분석 수행
  const stats = calculateOverallStats(currentResults);
  const trends = analyzeTimeTrend(currentResults, history);
  const slowTests = findSlowTests(currentResults);
  const regressions = detectRegressions(trends);

  // 3. 결과 저장
  const analysisResult = {
    timestamp: new Date().toISOString(),
    config: {
      regressionThreshold: CONFIG.regressionThreshold,
      slowTestTopN: CONFIG.slowTestTopN,
    },
    stats,
    trends,
    slowTests,
    regressions,
  };

  writeFileSync(CONFIG.outputFile, JSON.stringify(analysisResult, null, 2));

  // 4. Allure 통합 파일 생성
  generateEnvironmentInfo(stats, regressions, slowTests);
  generateCategories(regressions, slowTests);
  generateCustomWidgets(slowTests, regressions, stats, currentResults);

  // 5. 콘솔 리포트 출력
  printReport(stats, trends, regressions, slowTests);

  // 6. CI 환경에서 회귀 감지 시 경고
  if (process.env.CI && regressions.length > 0) {
    const criticalCount = regressions.filter((r) => r.severity === "critical").length;
    if (criticalCount > 0) {
      console.log(`\n🚨 CI WARNING: ${criticalCount} critical performance regressions detected!`);
      // 필요 시 exit code 1로 CI 실패 처리
      // process.exit(1);
    }
  }
}

main();
