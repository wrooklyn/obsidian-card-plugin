import { CardContainer } from 'components/CardContainer';
import { App, Plugin, MarkdownPostProcessorContext, MarkdownRenderChild } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { CardViewPluginSettings, DEFAULT_SETTINGS } from 'settings';
import { parseCardBlock } from 'utils/CardParser';
import { resolveVaultPath } from './utils/PathResolver';

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

		 // Get the resolveVaultPath function bound to the current app instance
		 const resolvePath = resolveVaultPath(this.app);

		 const resolvedCards = cards.map(card => ({
			...card,
			imageSrc: card.imageSrc ? resolvePath(card.imageSrc) : undefined,
			content: typeof card.content === 'object' && card.content.link
			  ? { 
				  ...card.content, 
				  link: `obsidian://open?vault=${encodeURIComponent(this.app.vault.getName())}&file=${encodeURIComponent(card.content.link)}`
				}
			  : card.content
		  }));
  
		const root = ReactDOM.createRoot(el);
		root.render(
			React.createElement(CardContainer, { cards:resolvedCards })
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