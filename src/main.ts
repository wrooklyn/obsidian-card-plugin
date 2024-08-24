import {Plugin} from 'obsidian';
import { CardViewSettingTab, DEFAULT_SETTINGS } from 'settings';
import { GlobalSettings } from 'interfaces/SettingsInterfaces';
import { processCodeBlock, refreshCardViews } from 'utils/utils';

export default class CardViewPlugin extends Plugin {
  settings: GlobalSettings;

  async onload() {
    await this.loadSettings();
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
}
