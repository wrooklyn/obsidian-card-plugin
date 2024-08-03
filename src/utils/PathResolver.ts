import { App, TFile } from 'obsidian';

export function resolveVaultPath(app: App) {
  return function (vaultPath: string): string {
    const file = app.vault.getAbstractFileByPath(vaultPath);
    if (file instanceof TFile) {
      return app.vault.getResourcePath(file);
    }
    console.warn(`File not found: ${vaultPath}`);
    return vaultPath; 
  };
}
