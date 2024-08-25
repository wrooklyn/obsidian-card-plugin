import {Plugin} from 'obsidian';
import { CardViewSettingTab, DEFAULT_SETTINGS } from 'settings';
import { GlobalSettings } from 'interfaces/SettingsInterfaces';
import { processCodeBlock, refreshCardViews } from 'utils/utils';

export default class CardViewPlugin extends Plugin {
  settings: GlobalSettings;

  async onload() {
    await this.loadSettings();
    this.loadMaterialIconsFont();
    this.loadGoogleFonts();

    this.addSettingTab(new CardViewSettingTab(this));
    this.registerMarkdownCodeBlockProcessor('cardview', (source, el, ctx) => {
      processCodeBlock(source, el, ctx, this.app, this.settings); 
    });

    // Listen for note changes
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => refreshCardViews(this.app)));
    this.registerEvent(this.app.vault.on('modify', () => refreshCardViews(this.app)));
  }

  async saveSettings() {
    await this.saveData(this.settings);
    refreshCardViews(this.app);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async resetSettings () {
    this.settings = Object.assign({}, DEFAULT_SETTINGS); 
    await this.saveSettings(); 
  }

  onunload() {
    this.resetSettings();
  }

  loadMaterialIconsFont() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(link);
  }
  loadGoogleFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@200..800&family=Encode+Sans+SC:wght@100..900&family=Karla:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet';
    document.head.appendChild(link);
  }
}
