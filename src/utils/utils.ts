import { PaddingStyle, TextStyle } from "interfaces/CommonStyleInterfaces";
import { iconMap } from "./IconMap";
import { FontWeight, IconCategory, IconPosition, TextLevel } from "./types";
import { Setting } from "obsidian";
import { GlobalSettings } from "interfaces/SettingsInterfaces";
import CardViewPlugin from "main";

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

//settings.ts

export const createDropdownSetting=(
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
  }

  export const createTextInputSetting=(
    containerEl: HTMLElement,
    label: string,
    desc: string,
    currentValue: string,
    onChange: (value: string) => void
  ) =>{
    new Setting(containerEl)
      .setName(label)
      .setDesc(desc)
      .addText((text) => text.setValue(currentValue).onChange(onChange));
  }

  // Function to apply settings to a typography section
export const  configureTypographySection = (
    containerEl: HTMLElement,
    sectionLabel: string,
    section: keyof GlobalSettings["typography"],
    pluginSettings: GlobalSettings,
    plugin: CardViewPlugin
  ) => {
    const sectionSettings = pluginSettings.typography[section] || ({} as TextStyle);
  
    // Font Weight Dropdown
    createDropdownSetting(
      containerEl,
      `${sectionLabel} - Font Weight`,
      `Set the font weight for the ${sectionLabel.toLowerCase()}`,
      sectionSettings.fontWeight || 'regular',
      {
        light: 'Light',
        regular: 'Regular',
        medium: 'Medium',
        bold: 'Bold',
      },
      async (value: string) => {
        sectionSettings.fontWeight = value as FontWeight;
        pluginSettings.typography[section] = sectionSettings;
        await plugin.saveSettings();
      }
    );
  
    // Text Level Dropdown
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
  
    // Font Input
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
  
    // Font Size Input
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
  
    // Font Color Input
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
  }
  
export const capitalizeFirstLetter=(text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}