import { setWorldConstructor, World } from "@cucumber/cucumber";
import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "@playwright/test";
import { setupServer } from "msw/node";

import { workloadHandlers } from "@/handlers/workload.handler";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  mswServer = setupServer(...workloadHandlers);

  async initBrowser() {
    this.browser = await chromium.launch({
      headless: process.env.CI === "true",
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    this.page = await this.context.newPage();
  }

  async initMSW() {
    await this.mswServer.listen({ onUnhandledRequest: "bypass" });
  }

  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    this.mswServer.resetHandlers();
    this.mswServer.close();
  }
}

setWorldConstructor(CustomWorld);
