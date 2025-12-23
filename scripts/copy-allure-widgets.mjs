#!/usr/bin/env node

import { existsSync, cpSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * 커스텀 Allure 위젯을 리포트 디렉토리에 복사
 *
 * Allure는 allure-report/widgets/ 에서 위젯 JSON을 읽습니다.
 * 성능 분석 스크립트가 생성한 커스텀 위젯을 리포트에 복사합니다.
 */
function copyCustomWidgets() {
  const srcWidgets = join(process.cwd(), "allure-results", "widgets");
  const dstWidgets = join(process.cwd(), "allure-report", "widgets");

  if (!existsSync(srcWidgets)) {
    console.log("⚠️  No custom widgets found in allure-results/widgets");
    return;
  }

  if (!existsSync(dstWidgets)) {
    console.log("⚠️  allure-report/widgets not found. Run allure generate first.");
    return;
  }

  try {
    const files = readdirSync(srcWidgets).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      cpSync(join(srcWidgets, file), join(dstWidgets, file));
    }

    console.log(`✓ Copied ${files.length} custom widget(s) to allure-report/widgets`);
  } catch (error) {
    console.error("Failed to copy widgets:", error.message);
    process.exit(1);
  }
}

copyCustomWidgets();
