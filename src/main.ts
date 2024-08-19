import { GlobalSettings } from 'interfaces/SettingsInterfaces';
import { App, Plugin, MarkdownPostProcessorContext, MarkdownRenderChild, SettingTab, MarkdownView } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {CardViewSettingTab, DEFAULT_SETTINGS } from 'settings';


export default class CardViewPlugin extends Plugin {
  settings: GlobalSettings;

    async onload() {
    }
    async saveSettings() {
        await this.saveData(this.settings);
        //this.refreshCardViews();
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
      }
      
}