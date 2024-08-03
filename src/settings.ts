import { PluginSettingTab, Setting } from 'obsidian';
import CardViewPlugin from './main';

export interface CardViewPluginSettings {
  borderRadius: string;
  backgroundColor: string;
  maxWidth: string;
  maxHeight: string;
}

export const DEFAULT_SETTINGS: CardViewPluginSettings = {
  borderRadius: '8px',
  backgroundColor: '#fff',
  maxWidth: '250px',
  maxHeight: '200px'
};

export class CardViewSettingTab extends PluginSettingTab {
  plugin: CardViewPlugin;

  constructor(plugin: CardViewPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    new Setting(containerEl)
      .setName('Border Radius')
      .addText(text => text
        .setValue(this.plugin.settings.borderRadius)
        .onChange(async (value) => {
          this.plugin.settings.borderRadius = value;
          await this.plugin.saveSettings();
    }));
    new Setting(containerEl)
      .setName('Background Color')
      .addText(text => text
        .setValue(this.plugin.settings.backgroundColor)
        .onChange(async (value) => {
          this.plugin.settings.backgroundColor = value;
          await this.plugin.saveSettings();
    }));
    new Setting(containerEl)
      .setName('Max Width')
      .addText(text => text
        .setValue(this.plugin.settings.maxWidth)
        .onChange(async (value) => {
          this.plugin.settings.maxWidth = value;
          await this.plugin.saveSettings();
    }));
    new Setting(containerEl)
    .setName('Max Height')
    .addText(text => text
      .setValue(this.plugin.settings.maxHeight)
      .onChange(async (value) => {
        this.plugin.settings.maxHeight = value;
        await this.plugin.saveSettings();
  }));
  }
}
