import { ContentStyle, PaddingStyle, TextStyle } from "interfaces/CommonStyleInterfaces";
import { App, MarkdownPostProcessorContext, MarkdownRenderChild, MarkdownView, TFile } from 'obsidian';
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
import { iconMap } from "./IconMap";

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
  section: keyof GlobalSettings["contentStyle"],
  pluginSettings: GlobalSettings,
  plugin: CardViewPlugin
) => {
  const sectionSettings = pluginSettings.contentStyle[section] || ({} as TextStyle);

  createDropdownSetting(
    containerEl,
    `${sectionLabel} - Font Weight`,
    `Set the font weight for the ${sectionLabel.toLowerCase()}`,
    sectionSettings.fontWeight || 'regular',
    { light: 'Light', regular: 'Regular', medium: 'Medium', bold: 'Bold' },
    async (value: string) => {
      sectionSettings.fontWeight = value as FontWeight;
      pluginSettings.contentStyle[section] = sectionSettings;
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
      pluginSettings.contentStyle[section] = sectionSettings;
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
      pluginSettings.contentStyle[section] = sectionSettings;
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
      pluginSettings.contentStyle[section] = sectionSettings;
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
      pluginSettings.contentStyle[section] = sectionSettings;
      await plugin.saveSettings();
    }
  );
};

/**
 * Merges multiple settings objects. Priority is given from right to left.
 * Card-specific settings > Template-specific settings > Global settings > Default settings.
 * @param settingsList - An array of settings objects to merge.
 * @returns The merged settings object.
 */
function mergeSettings(...settingsList: any[]): any {
  return settingsList.reduce((acc, settings) => {
    if (!settings) return acc;

    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        const value = settings[key];

        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
      }
    }
    return acc;
  }, {});
}



export const getIconByCategory = (category: IconCategory): JSX.Element | null => {
  return iconMap[category] || null;
};

export const iconPositionMap: Record<IconPosition, (padding?: PaddingStyle) => object> = {
  'top-left': (padding) => ({ top: padding?.paddingTop ?? '0', left: padding?.paddingLeft ?? '0' }),
  'top-right': (padding) => ({ top: padding?.paddingTop ?? '0', right: padding?.paddingRight ?? '0' }),
  'bottom-left': (padding) => ({ bottom: padding?.paddingBottom ?? '0', left: padding?.paddingLeft ?? '0' }),
  'bottom-right': (padding) => ({ bottom: padding?.paddingBottom ?? '0', right: padding?.paddingRight ?? '0' }),
  'top-center': (padding) => ({ top: padding?.paddingTop ?? '0', left: '50%', transform: 'translateX(-50%)' }),
  'bottom-center': (padding) => ({ bottom: padding?.paddingBottom ?? '0', left: '50%', transform: 'translateX(-50%)' }),
};

/**
 * ------------- CARD CONTENT RESOLUTION -------------
 */


const resolveCardStyle = (cardStyle: CardStyle = {}, settingsTabCardStyle: CardStyle={}, templateCardStyle: CardStyle={}): CardStyle => {
  return mergeSettings(DEFAULT_SETTINGS.cardStyle, settingsTabCardStyle, templateCardStyle, cardStyle);
};


const resolveImage = (image: Image, resolvePath: (src: string) => string, settingsTabImageStyle?: ImageStyle, templateImageStyle?: ImageStyle): Image => {
  const mergedImageStyle = mergeSettings(DEFAULT_SETTINGS.imageStyle, settingsTabImageStyle, templateImageStyle, image.style);

  return {
    src: resolvePath(image.src),
    style: mergedImageStyle,
  };
};



const resolveCardContent = (app: App, content: CardTextContent, settingsTab: ContentStyle={}, templateSettings: ContentStyle={}): CardTextContent => {
  return {
    link: content.link,
    heading: content.heading ? resolveTextSection(content.heading, settingsTab.heading, templateSettings.heading) : undefined,
    title: content.title ? resolveTextSection(content.title, settingsTab.title, templateSettings.title) : undefined,
    subtitle: content.subtitle ? resolveTextSection(content.subtitle, settingsTab.subtitle, templateSettings.subtitle) : undefined,
    body: content.body ? resolveTextSection(content.body, settingsTab.body, templateSettings.body) : undefined,
    list: content.list ? content.list.map((linkItem) => resolveLinkItem(app, linkItem, settingsTab.links, templateSettings.links)) : undefined,
    position: content?.position,
    expandable: content.expandable ?? false, //CHECK LATER
  };
};


const resolveTextSection = (section: TextSection, settingsTabTypography?: TextStyle, templateTypography?: TextStyle): TextSection => {
  const mergedTypography = mergeSettings(
    DEFAULT_SETTINGS.contentStyle.heading,
    settingsTabTypography,         
    templateTypography,       
    section.typography        
  );

  return {
    text: section.text,
    typography: mergedTypography,
  };
};

/**
 * Resolves a link item within a card, generating the correct Obsidian URI if applicable.
 * @param app - The current Obsidian app instance.
 * @param item - The LinkItem object containing the link and its associated text.
 * @returns The resolved LinkItem object with the correct URI.
 */
const resolveLinkItem = (app: App, linkItem: LinkItem, settingsTabLinks: TextStyle | undefined, templateLinks: TextStyle | undefined): LinkItem => {
  const mergedTypography = mergeSettings(
    DEFAULT_SETTINGS.contentStyle.links,
    settingsTabLinks,         
    templateLinks,       
    linkItem.typography        
  );
  return {
    ...linkItem,
    link: generateObsidianURI(app, linkItem.link),
    typography: mergedTypography
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
const processCardBlock = (app: App, codeBlock: CardViewConfig, templateSettings: CardTemplate, settingsTab: GlobalSettings): Card[] => {
  const resolvePath = resolveVaultPath(app);

  return codeBlock.cards.map((card) => ({
    style: resolveCardStyle(card.style, settingsTab?.cardStyle,  templateSettings?.cardStyle),
    image: card.image? resolveImage(card.image, resolvePath, settingsTab?.imageStyle, templateSettings?.imageStyle) : undefined,
    content: card.content? resolveCardContent(app, card.content, settingsTab.contentStyle, templateSettings?.contentStyle) : undefined,
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
 * @param settingsTab - The global plugin settings object.
 */
export async function processCodeBlock(
  source: string,
  el: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  app: App,
  settingsTab: GlobalSettings
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

    let cards: Card[] = processCardBlock(app, codeBlock, templateSettings, settingsTab);

    const root = ReactDOM.createRoot(el);
    root.render(
      createElement(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '16px' } },
        cards.map((card, index) => createElement(CustomCard, { ...card, key: index}))
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

