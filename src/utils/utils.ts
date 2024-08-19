import { PaddingStyle, TextStyle } from "interfaces/CommonStyleInterfaces";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, TFile } from 'obsidian';
import { iconMap } from "./IconMap";
import { FontWeight, IconCategory, IconPosition, TextLevel } from "./types";
import { Setting } from "obsidian";
import { GlobalSettings } from "interfaces/SettingsInterfaces";
import CardViewPlugin from "main";
import { CardViewConfig } from "interfaces/CardViewInterfaces";
import { createElement } from "react";
import { CustomCard } from "components/CustomCard";
import * as ReactDOM from 'react-dom/client';
import { DEFAULT_SETTINGS } from "settings";
import { TextSection, LinkItem, Card, Metadata, ActionIcon, CardStyle, CardTextContent } from "interfaces/CardInterfaces";
import { CardTemplate } from "interfaces/CardTemplateInterface";
import { ImageStyle, Image } from "interfaces/ImageInterfaces";

/**
 * ------------- SETTINGS HANDLING -------------
 */

/**
 * Creates a dropdown setting in the plugin's settings UI.
 * @param containerEl - The container element for the setting.
 * @param label - The label for the setting.
 * @param desc - A description of what the setting does.
 * @param currentValue - The current value of the dropdown.
 * @param options - A key-value pair of dropdown options.
 * @param onChange - A callback function triggered when the value changes.
 */
export const createDropdownSetting = (
  containerEl: HTMLElement,
  label: string,
  desc: string,
  currentValue: string,
  options: { [value: string]: string },
  onChange: (value: string) => void
) => {
  new Setting(containerEl)
    .setName(label)
    .setDesc(desc)
    .addDropdown((dropdown) => {
      Object.entries(options).forEach(([value, display]) => dropdown.addOption(value, display));
      dropdown.setValue(currentValue).onChange(onChange);
    });
};

/**
 * Creates a text input setting in the plugin's settings UI.
 * @param containerEl - The container element for the setting.
 * @param label - The label for the setting.
 * @param desc - A description of what the setting does.
 * @param currentValue - The current value of the text input.
 * @param onChange - A callback function triggered when the value changes.
 */
export const createTextInputSetting = (
  containerEl: HTMLElement,
  label: string,
  desc: string,
  currentValue: string,
  onChange: (value: string) => void
) => {
  new Setting(containerEl)
    .setName(label)
    .setDesc(desc)
    .addText((text) => text.setValue(currentValue).onChange(onChange));
};

/**
 * Configures typography settings for a given section (e.g., heading, title, body).
 * @param containerEl - The container element for the setting.
 * @param sectionLabel - The label for the typography section (e.g., "Heading").
 * @param section - The section key in the typography settings object.
 * @param pluginSettings - The global plugin settings object.
 * @param plugin - The instance of the CardViewPlugin.
 */
export const configureTypographySection = (
  containerEl: HTMLElement,
  sectionLabel: string,
  section: keyof GlobalSettings["typography"],
  pluginSettings: GlobalSettings,
  plugin: CardViewPlugin
) => {
  const sectionSettings = pluginSettings.typography[section] || ({} as TextStyle);

  createDropdownSetting(
    containerEl,
    `${sectionLabel} - Font Weight`,
    `Set the font weight for the ${sectionLabel.toLowerCase()}`,
    sectionSettings.fontWeight || 'regular',
    { light: 'Light', regular: 'Regular', medium: 'Medium', bold: 'Bold' },
    async (value: string) => {
      sectionSettings.fontWeight = value as FontWeight;
      pluginSettings.typography[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );

  createDropdownSetting(
    containerEl,
    `${sectionLabel} - Text Level`,
    `Set the text level for the ${sectionLabel.toLowerCase()}`,
    sectionSettings.level || 'body-md',
    {
      'h1': 'H1',
      'h2': 'H2',
      'h3': 'H3',
      'h4': 'H4',
      'title-lg': 'Title LG',
      'title-md': 'Title MD',
      'title-sm': 'Title SM',
      'body-lg': 'Body LG',
      'body-md': 'Body MD',
      'body-sm': 'Body SM',
      'body-xs': 'Body XS',
    },
    async (value: string) => {
      sectionSettings.level = value as TextLevel;
      pluginSettings.typography[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );

  createTextInputSetting(
    containerEl,
    `${sectionLabel} - Font`,
    `Set the font for the ${sectionLabel.toLowerCase()}`,
    sectionSettings.font || 'Karla',
    async (value: string) => {
      sectionSettings.font = value;
      pluginSettings.typography[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );

  createTextInputSetting(
    containerEl,
    `${sectionLabel} - Font Size`,
    `Set the font size for the ${sectionLabel.toLowerCase()} (e.g., 12px)`,
    sectionSettings.fontSize || '12px',
    async (value: string) => {
      sectionSettings.fontSize = value;
      pluginSettings.typography[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );

  createTextInputSetting(
    containerEl,
    `${sectionLabel} - Font Color`,
    `Set the font color for the ${sectionLabel.toLowerCase()} (e.g., #707070)`,
    sectionSettings.color || '#707070',
    async (value: string) => {
      sectionSettings.color = value;
      pluginSettings.typography[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );
};

/**
 * Merges and applies card settings in the following order of precedence:
 * 1. Default settings
 * 2. Global plugin settings
 * 3. Template-specific settings
 * 4. Code block-specific settings
 * @param defaultSettings - The default settings.
 * @param globalSettings - The global plugin settings.
 * @param templateSettings - The template-specific settings.
 * @param codeBlockSettings - The code block-specific settings.
 * @returns The final merged settings.
 */
const applyCardSettings = (
  defaultSettings: any,
  globalSettings: any,
  templateSettings: any,
  codeBlockSettings: any
): any => {
  return {
    ...defaultSettings,
    ...globalSettings,
    ...templateSettings,
    ...codeBlockSettings,
  };
};

/**
 * ------------- CARD CONTENT RESOLUTION -------------
 */

/**
 * Resolves the card style settings (e.g., height, width, background color).
 * @param style - The style object for the card.
 * @returns The resolved CardStyle object.
 */
const resolveCardStyle = (style: CardStyle): CardStyle => {
  return {
    height: style.height || '200px',
    width: style.width || '300px',
    backgroundColor: style.backgroundColor || '#FFFFFF',
    cornerRadius: style.cornerRadius,
    resizable: style.resizable ?? true,
  };
};

/**
 * Resolves the image settings for a card, including the image path and styles.
 * @param image - The image object containing the source and style.
 * @param resolvePath - A function to resolve the image path.
 * @returns The resolved Image object.
 */
const resolveImage = (image: Image, resolvePath: (src: string) => string): Image => {
  return {
    ...image,
    src: resolvePath(image.src),
    style: image.style ? resolveImageStyle(image.style) : undefined,
  };
};

/**
 * Resolves the styles for an image within a card (e.g., position, fit, padding).
 * @param style - The ImageStyle object containing style information.
 * @returns The resolved ImageStyle object.
 */
const resolveImageStyle = (style: ImageStyle): ImageStyle => {
  return {
    position: style.position || 'center',
    fit: style.fit || 'cover',
    padding: style.padding,
    cornerRadius: style.cornerRadius,
    gradientOverlay: style.gradientOverlay ?? false,
  };
};

/**
 * Resolves the content settings within a card, such as text sections, lists, and links.
 * @param app - The current Obsidian app instance.
 * @param content - The content object containing text and layout information.
 * @returns The resolved CardTextContent object.
 */
const resolveCardContent = (app: App, content: CardTextContent): CardTextContent => {
  return {
    link: content.link,
    heading: content.heading ? resolveTextSection(content.heading) : undefined,
    title: content.title ? resolveTextSection(content.title) : undefined,
    subtitle: content.subtitle ? resolveTextSection(content.subtitle) : undefined,
    body: content.body ? resolveTextSection(content.body) : undefined,
    list: content.list ? content.list.map((item) => resolveLinkItem(app, item)) : undefined,
    position: content.position,
    expandable: content.expandable ?? false,
  };
};

/**
 * Resolves a text section within a card, including its typography settings.
 * @param section - The TextSection object containing the text and typography settings.
 * @returns The resolved TextSection object.
 */
const resolveTextSection = (section: TextSection): TextSection => {
  return {
    text: section.text,
    typography: section.typography,
  };
};

/**
 * Resolves a link item within a card, generating the correct Obsidian URI if applicable.
 * @param app - The current Obsidian app instance.
 * @param item - The LinkItem object containing the link and its associated text.
 * @returns The resolved LinkItem object with the correct URI.
 */
const resolveLinkItem = (app: App, item: LinkItem): LinkItem => {
  return {
    ...item,
    link: generateObsidianURI(app, item.link),
  };
};

/**
 * Resolves the action icon settings for a card, including its category, position, and size.
 * @param actionIcon - The ActionIcon object containing the icon configuration.
 * @returns The resolved ActionIcon object.
 */
const resolveActionIcon = (actionIcon: ActionIcon): ActionIcon => {
  return {
    category: actionIcon.category,
    variant: actionIcon.variant || 'plain',
    size: actionIcon.size || 'md',
    position: actionIcon.position || 'top-right',
    padding: actionIcon.padding,
    disabled: actionIcon.disabled ?? false,
    onClick: actionIcon.onClick,
    ariaLabel: actionIcon.ariaLabel || 'Action Icon',
  };
};

/**
 * Resolves the metadata for a card, such as tags or additional details.
 * @param metadata - The Metadata object containing the tags.
 * @returns The resolved Metadata object.
 */
const resolveMetadata = (metadata: Metadata): Metadata => {
  return {
    tags: metadata.tags || [],
  };
};

/**
 * Processes a card block, resolving all settings and configurations for each card.
 * @param app - The current Obsidian app instance.
 * @param codeBlock - The parsed CardViewConfig object containing the card definitions.
 * @returns An array of resolved Card objects.
 */
const processCardBlock = (app: App, codeBlock: CardViewConfig): Card[] => {
  const resolvePath = resolveVaultPath(app);

  return codeBlock.cards.map((card) => ({
    style: card.style ? resolveCardStyle(card.style) : undefined,
    image: card.image ? resolveImage(card.image, resolvePath) : undefined,
    content: card.content ? resolveCardContent(app, card.content) : undefined,
    actionIcon: card.actionIcon ? resolveActionIcon(card.actionIcon) : undefined,
    metadata: card.metadata ? resolveMetadata(card.metadata) : undefined,
  }));
};

/**
 * ------------- MARKDOWN PROCESSING -------------
 */

/**
 * Processes the content of a code block and renders the card view using the resolved settings.
 * @param source - The content of the code block.
 * @param el - The HTML element where the rendered content will be inserted.
 * @param ctx - The Markdown post-processor context.
 * @param app - The current Obsidian app instance.
 * @param pluginSettings - The global plugin settings object.
 */
export async function processCodeBlock(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  app: App,
  pluginSettings: GlobalSettings
) {
  try {
    const codeBlock: CardViewConfig = parseCodeBlock(source);

    let templateSettings: CardTemplate = {};
    if (typeof codeBlock.template === 'string') {
      const template = await fetchTemplate(app, codeBlock.template);
      if (template) {
        templateSettings = template;
      }
    } else if (typeof codeBlock.template === 'object') {
      templateSettings = codeBlock.template;
    }

    let cards: Card[] = processCardBlock(app, codeBlock);

    const finalSettings = applyCardSettings(DEFAULT_SETTINGS, pluginSettings, templateSettings, codeBlock);

    const root = ReactDOM.createRoot(el);
    root.render(
      createElement(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '16px' } },
        cards.map((card, index) => createElement(CustomCard, { ...card, key: index, style: card.style }))
      )
    );

    ctx.addChild(
      new class extends MarkdownRenderChild {
        constructor(containerEl: HTMLElement) {
          super(containerEl);
        }

        onunload() {
          root.unmount();
        }
      }(el)
    );
  } catch (error) {
    console.error('Error processing cardview block:', error);
    el.innerHTML = `<div style="color: red;">Failed to render cards. Please check your syntax. Error: ${error.message}</div>`;
  }
}

/**
 * ------------- UTILITY FUNCTIONS -------------
 */

/**
 * Utility function to generate an Obsidian URI to open a specific file within the vault.
 * @param app - The current Obsidian app instance.
 * @param filePath - The relative path to the file within the vault.
 * @returns The fully-formed Obsidian URI that can be used to open the file.
 */
export const generateObsidianURI = (app: App, filePath: string): string => {
  const vaultName = encodeURIComponent(app.vault.getName());
  const encodedFilePath = encodeURIComponent(filePath);

  return `obsidian://open?vault=${vaultName}&file=${encodedFilePath}`;
};

/**
 * Refreshes the card views by forcing a re-render in the preview mode.
 * @param app - The current Obsidian app instance.
 */
export const refreshCardViews = (app: App) => {
  app.workspace.iterateRootLeaves((leaf) => {
    const view = leaf.view;
    if (view instanceof MarkdownView) {
      if (view.previewMode) {
        view.previewMode.rerender(true);
      }
    }
  });
};

/**
 * Resolves the correct vault path for a file, returning the resource path if found.
 * @param app - The current Obsidian app instance.
 * @returns A function that takes a vault path and returns the resolved path.
 */
export const resolveVaultPath = (app: App) => {
  return function (vaultPath: string): string {
    const file = app.vault.getAbstractFileByPath(vaultPath);
    if (file instanceof TFile) {
      return app.vault.getResourcePath(file);
    }
    console.warn(`File not found: ${vaultPath}`);
    return vaultPath;
  };
};

/**
 * Fetches a template from the specified path within the vault.
 * @param app - The current Obsidian app instance.
 * @param templatePath - The path to the template file.
 * @returns A Promise that resolves to the template object, or an empty object if not found.
 */
async function fetchTemplate(app: App, templatePath: string): Promise<CardTemplate | {}> {
  try {
    const file = app.vault.getAbstractFileByPath(templatePath);
    if (file instanceof TFile) {
      const content = await app.vault.read(file);
      return JSON.parse(content) as CardTemplate;
    }
  } catch (error) {
    console.error(`Failed to load template at ${templatePath}:`, error);
  }
  return {};
}

/**
 * Parses the content of a code block into a CardViewConfig object.
 * @param content - The content of the code block.
 * @returns The parsed CardViewConfig object.
 */
const parseCodeBlock = (content: string): CardViewConfig => {
  try {
    const cleanedContent = content.replace(/^```cardview\s*/, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleanedContent) as CardViewConfig;
  } catch (error) {
    console.error('Error parsing card block:', error);
    throw error;
  }
};


/**
 * Capitalizes the first letter of a given string.
 * @param text - The input string to capitalize.
 * @returns The input string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

