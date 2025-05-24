// src/store/settingsStore.ts

import { putSetting, getSetting } from "./db";

const settingsData: Record<string, any> = {};

export function initializeSettings(
  settingArray: { key: string; value: any }[]
) {
  for (const setting of settingArray) {
    settingsData[setting.key] = setting.value;
  }
}

export function getSettingValue<T = any>(key: string): T | null {
  return settingsData[key] ?? null;
}

export async function setSettingValue<T = any>(key: string, value: T) {
  settingsData[key] = value;
  await putSetting(key, value);
}
