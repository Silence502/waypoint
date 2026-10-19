import { load } from "@tauri-apps/plugin-store";

const storeInstance = await load("settings.json", { autoSave: true });

export async function setSetting(key: string, value: any) {
  await storeInstance.set(key, value);
  await storeInstance.save();
}

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const value = await storeInstance.get<T>(key);
  return value ?? defaultValue;
}
