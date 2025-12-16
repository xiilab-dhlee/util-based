#!/usr/bin/env node

import { existsSync, cpSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Allure history를 이전 리포트에서 새 결과 디렉토리로 복사
 * 이를 통해 테스트 실행 간 히스토리와 트렌드를 유지할 수 있습니다.
 */
function copyAllureHistory() {
  const src = join(process.cwd(), 'allure-report', 'history');
  const dst = join(process.cwd(), 'allure-results', 'history');

  if (!existsSync(src)) {
    console.log('No previous allure history found. Skipping copy.');
    return;
  }

  try {
    cpSync(src, dst, { recursive: true });
    console.log('✓ Allure history copied successfully');
  } catch (error) {
    console.error('Failed to copy allure history:', error.message);
    process.exit(1);
  }
}

copyAllureHistory();
