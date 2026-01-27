import { getWorkloadPreviewFileMockHandler } from "@/api/generated/workload/workload.msw";
import {
  isPreviewableImage,
  isPreviewableText,
  normalizeExtension,
} from "@/shared/utils/file.util";

/**
 * 샘플 이미지 - 100x100 그라데이션 PNG (실제 보이는 이미지)
 * 간단한 그라데이션 이미지 base64
 */
const SAMPLE_IMAGE_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC";

/**
 * 샘플 SVG 이미지 (100x100 원형 그라데이션)
 * SVG XML을 base64로 인코딩
 */
const SAMPLE_IMAGE_SVG =
  btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#grad)" rx="8"/>
  <text x="50" y="55" font-family="Arial" font-size="14" fill="white" text-anchor="middle">SVG</text>
</svg>`);

/**
 * 확장자별 샘플 텍스트 콘텐츠
 */
const SAMPLE_TEXT_CONTENTS: Record<string, string> = {
  txt: `Hello, World!
This is a sample text file for preview testing.
워크로드 파일 미리보기 테스트용 텍스트 파일입니다.

Line 1: Sample content
Line 2: More content
Line 3: End of file`,

  log: `[2024-01-15 10:30:00] INFO - Application started
[2024-01-15 10:30:01] INFO - Loading configuration...
[2024-01-15 10:30:02] INFO - Configuration loaded successfully
[2024-01-15 10:30:03] DEBUG - Initializing modules
[2024-01-15 10:30:05] INFO - Server listening on port 8080
[2024-01-15 10:31:00] INFO - Request received: GET /api/health
[2024-01-15 10:31:00] INFO - Response sent: 200 OK`,

  md: `# Sample Markdown File

## Overview
This is a **sample markdown** file for preview testing.

### Features
- Feature 1: Bold text support
- Feature 2: *Italic text* support
- Feature 3: Code blocks

\`\`\`python
print("Hello, World!")
\`\`\`

> This is a blockquote

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |`,

  json: `{
  "name": "sample-project",
  "version": "1.0.0",
  "description": "Sample JSON file for preview",
  "author": "Developer",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "config": {
    "port": 3000,
    "debug": true
  }
}`,

  yaml: `# Sample YAML Configuration
name: sample-project
version: "1.0.0"

server:
  host: localhost
  port: 8080
  
database:
  type: postgresql
  host: db.example.com
  port: 5432
  
logging:
  level: info
  format: json`,

  yml: `# Training Configuration
model:
  name: resnet50
  pretrained: true
  
training:
  epochs: 100
  batch_size: 32
  learning_rate: 0.001
  
data:
  train_path: /data/train
  val_path: /data/val`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <name>Sample Project</name>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
      <groupId>org.example</groupId>
      <artifactId>sample-lib</artifactId>
      <version>2.0.0</version>
    </dependency>
  </dependencies>
</project>`,

  csv: `id,name,email,score
1,Alice,alice@example.com,95
2,Bob,bob@example.com,87
3,Charlie,charlie@example.com,92
4,Diana,diana@example.com,88
5,Eve,eve@example.com,91`,

  sh: `#!/bin/bash

# Sample Shell Script
echo "Starting deployment..."

# Set variables
APP_NAME="my-app"
ENV="production"

# Deploy application
docker build -t $APP_NAME .
docker push $APP_NAME:latest

echo "Deployment complete!"`,

  bash: `#!/bin/bash

# Bash script for data processing
set -e

INPUT_DIR="/data/input"
OUTPUT_DIR="/data/output"

for file in $INPUT_DIR/*.csv; do
    echo "Processing $file..."
    python process.py --input "$file" --output "$OUTPUT_DIR"
done

echo "All files processed successfully!"`,

  py: `#!/usr/bin/env python3
"""Sample Python script for machine learning."""

import torch
import torch.nn as nn

class SimpleModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

if __name__ == "__main__":
    model = SimpleModel(784, 256, 10)
    print(f"Model parameters: {sum(p.numel() for p in model.parameters())}")`,

  js: `// Sample JavaScript file
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/data', async (req, res) => {
  const { data } = req.body;
  console.log('Received data:', data);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,

  ts: `// Sample TypeScript file
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  return { data, status: 'success' };
}

export { fetchUser, type User, type ApiResponse };`,

  java: `package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(defaultValue = "World") String name) {
        return String.format("Hello, %s!", name);
    }
}`,

  kt: `package com.example.demo

import kotlinx.coroutines.*

data class User(
    val id: Int,
    val name: String,
    val email: String
)

class UserRepository {
    suspend fun getUser(id: Int): User = withContext(Dispatchers.IO) {
        // Simulate network call
        delay(100)
        User(id, "User $id", "user$id@example.com")
    }
}

fun main() = runBlocking {
    val repo = UserRepository()
    val user = repo.getUser(1)
    println("User: $user")
}`,

  kts: `// Gradle Kotlin DSL build script
plugins {
    kotlin("jvm") version "1.9.0"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("MainKt")
}`,

  go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Response struct {
	Status  string \`json:"status"\`
	Message string \`json:"message"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	resp := Response{Status: "ok", Message: "Service is healthy"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.HandleFunc("/health", healthHandler)
	fmt.Println("Server starting on :8080")
	http.ListenAndServe(":8080", nil)
}`,
};

/**
 * 파일 경로에서 확장자 추출
 */
function getExtensionFromPath(path: string): string | null {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return null;
  return filename.substring(dotIndex + 1).toLowerCase();
}

/**
 * 워크로드 파일 미리보기 override 핸들러
 *
 * 이미지 파일: 순수 base64 문자열 반환 (data: prefix 없음)
 * 텍스트 파일: 텍스트 콘텐츠 반환
 */
export const workloadFilePreviewOverrideHandlers = [
  getWorkloadPreviewFileMockHandler(async (info) => {
    const url = new URL(info.request.url);
    const path = url.searchParams.get("path") || "";

    const extension = getExtensionFromPath(path);
    const normalizedExt = normalizeExtension(extension);

    // 이미지 파일인 경우 순수 base64 문자열 반환 (hub-card 스타일)
    // SVG는 SVG 형식의 base64, 나머지는 PNG base64 반환
    if (isPreviewableImage(extension)) {
      return normalizedExt === "svg" ? SAMPLE_IMAGE_SVG : SAMPLE_IMAGE_PNG;
    }

    // 텍스트 파일인 경우 샘플 텍스트 반환
    if (isPreviewableText(extension)) {
      return (
        SAMPLE_TEXT_CONTENTS[normalizedExt ?? "txt"] ?? SAMPLE_TEXT_CONTENTS.txt
      );
    }

    // 지원하지 않는 파일 형식
    return "Preview not available for this file type.";
  }),
];
