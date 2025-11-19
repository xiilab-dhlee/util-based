#!/usr/bin/env node

/**
 * bddgen이 필요한지 확인하는 스크립트
 * feature 파일이나 step 파일이 변경되었을 때만 bddgen을 실행
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const FEATURES_DIR = path.join(__dirname, "../tests/features");
const STEPS_DIR = path.join(__dirname, "../tests/steps");
// playwright-bdd는 루트에 .features-gen 디렉토리를 생성함
const GENERATED_DIR = path.join(__dirname, "../.features-gen");

// 생성된 파일의 타임스탬프를 저장하는 파일
const TIMESTAMP_FILE = path.join(__dirname, "../.bddgen-timestamp");

function getLastModifiedTime(dir) {
  let maxTime = 0;

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        maxTime = Math.max(maxTime, stat.mtimeMs);
      }
    }
  }

  if (fs.existsSync(dir)) {
    walkDir(dir);
  }

  return maxTime;
}

function needsRegeneration() {
  // 타임스탬프 파일이 없으면 생성 필요
  if (!fs.existsSync(TIMESTAMP_FILE)) {
    return true;
  }

  const lastGenTime = parseFloat(
    fs.readFileSync(TIMESTAMP_FILE, "utf8").trim(),
  );

  // 타임스탬프가 유효하지 않으면 생성 필요
  if (isNaN(lastGenTime) || lastGenTime <= 0) {
    return true;
  }

  // feature 파일들의 최종 수정 시간
  const featuresTime = getLastModifiedTime(FEATURES_DIR);

  // step 파일들의 최종 수정 시간
  const stepsTime = getLastModifiedTime(STEPS_DIR);

  const maxSourceTime = Math.max(featuresTime, stepsTime);

  // 소스 파일이 타임스탬프보다 최근에 수정되었으면 재생성 필요
  if (maxSourceTime > lastGenTime) {
    return true;
  }

  // 소스 파일이 변경되지 않았고, 생성된 디렉토리와 파일이 모두 존재하면 재생성 불필요
  if (fs.existsSync(GENERATED_DIR)) {
    const generatedTime = getLastModifiedTime(GENERATED_DIR);
    // 생성된 파일이 있으면 재생성 불필요
    if (generatedTime > 0) {
      return false;
    }
  }

  // 소스 파일은 변경되지 않았지만, 생성된 파일이 없으면 생성 필요
  // (타임스탬프는 있지만 실제 파일이 없는 경우 - 예: 디렉토리 삭제됨)
  return true;
}

if (needsRegeneration()) {
  console.log("🔄 Feature 또는 step 파일이 변경되어 bddgen을 실행합니다...");
  // pnpm exec 대신 npx 사용 (bddgen 스크립트와 동일하게)
  execSync("npx playwright-bdd export", { stdio: "inherit" });

  // 타임스탬프 업데이트 (현재 시간으로)
  const currentTime = Date.now();
  fs.writeFileSync(TIMESTAMP_FILE, currentTime.toString());
  console.log("✅ bddgen 완료");
} else {
  console.log("⏭️  변경사항이 없어 bddgen을 건너뜁니다.");
}
