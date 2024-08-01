import { App, Plugin, MarkdownPostProcessorContext, MarkdownRenderChild } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { parseCardBlock } from './src/utils/CardParser';
import { CardContainer } from './src/components/CardContainer';
import { CardViewPluginSettings, DEFAULT_SETTINGS } from './src/settings';
import { parseDataviewQuery } from './src/utils/DataViewQueryParser';

export default class CardViewPlugin extends Plugin {
  settings: CardViewPluginSettings;

  async onload() {
    await this.loadSettings();

    this.registerMarkdownCodeBlockProcessor("cardview", this.processCardView.bind(this));
  }

  async processCardView(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
	try {
	  	let cards = [];
		cards = parseCardBlock(source);
  
		const root = ReactDOM.createRoot(el);
		root.render(
			React.createElement(CardContainer, { cards })
		);
	
		ctx.addChild(new class extends MarkdownRenderChild {
			constructor(containerEl: HTMLElement) {
				super(containerEl);
			}
	
			onunload() {
			root.unmount();

			}
		}(el));

	} catch (error) {
		console.error("Error processing cardview block:", error);
		console.error("Error stack:", error.stack); // Log the full error stack
		el.innerHTML = `<div style="color: red;">Failed to render cards. Please check your syntax. Error: ${error.message}</div>`;
	}
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}