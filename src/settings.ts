import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { GlobalSettings } from './interfaces/SettingsInterfaces';
import CardViewPlugin from 'main';
import { CornerRadius, PaddingStyle, TextStyle } from 'interfaces/CommonStyleInterfaces';
import { ContentStyle } from 'interfaces/CardTemplateInterface';
import { FontWeight, ImageFit, ImagePosition, TextLevel } from 'utils/types';
import { capitalizeFirstLetter, configureTypographySection} from 'utils/utils';

// Default settings
export const DEFAULT_SETTINGS: GlobalSettings = {
  cardStyle: {
    height: '200px',
    width: '200px',
    backgroundColor: '#F8F8FF',
    cornerRadius: {
      topLeft: '8px',
      topRight: '8px',
      bottomLeft: '8px',
      bottomRight: '8px',
    },
    resizable: true,
  },
  imageStyle: {
    position: 'center',
    fit: 'cover',
    padding: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
    },
    cornerRadius: {
      topLeft: '0px',
      topRight: '0px',
      bottomLeft: '0px',
      bottomRight: '0px',
    },
    gradientOverlay: false,
  },
  typography: {
    heading: {
      font: 'Karla',
      fontWeight: 'regular',
      fontSize: '12px',
      color: '#707070',
    },
    title: {
      font: 'Encode Sans SC',
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#000000',
    },
    subtitle: {
      font: 'Assistant',
      fontWeight: 'regular',
      fontSize: '11px',
      color: '#707070',
    },
    body: {
      font: 'Assistant',
      fontWeight: 'regular',
      fontSize: '11px',
      color: '#707070',
    },
    links: {
      font: 'Karla',
      fontWeight: 'regular',
      fontSize: '12px',
      color: '#39383A',
    },
  },
  horizontalScroll: false, 
};

// The Settings Tab
export class CardViewSettingTab extends PluginSettingTab {
  plugin: CardViewPlugin;

  constructor(app: App, plugin: CardViewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Card Plugin Settings' });

    containerEl.createEl('h3', { text: 'Card Settings' });

    // Card Style Settings
    new Setting(containerEl)
      .setName('Card Height')
      .setDesc('Set the height for the card (e.g., 200px)')
      .addText((text) =>
        text
          .setPlaceholder('200px')
          .setValue(this.plugin.settings.cardStyle.height || '200px')
          .onChange(async (value) => {
            this.plugin.settings.cardStyle.height = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Card Width')
      .setDesc('Set the width for the card (e.g., 200px)')
      .addText((text) =>
        text
          .setPlaceholder('200px')
          .setValue(this.plugin.settings.cardStyle.width || '200px')
          .onChange(async (value) => {
            this.plugin.settings.cardStyle.width = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Card Background Color')
      .setDesc('Set the background color of the card (e.g., #F8F8FF)')
      .addText((text) =>
        text
          .setPlaceholder('#F8F8FF')
          .setValue(this.plugin.settings.cardStyle.backgroundColor || '#F8F8FF')
          .onChange(async (value) => {
            this.plugin.settings.cardStyle.backgroundColor = value;
            await this.plugin.saveSettings();
          })
      );

    // Corner Radius Settings
    const cornerKeys: (keyof CornerRadius)[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

    cornerKeys.forEach((corner) => {
      new Setting(containerEl)
        .setName(`Corner Radius (${corner})`)
        .setDesc(`Set the card corner radius for ${corner} (e.g., 8px)`)
        .addText((text) =>
          text
            .setPlaceholder('8px')
            .setValue(this.plugin.settings.cardStyle.cornerRadius?.[corner] || '8px')
            .onChange(async (value) => {
              if (!this.plugin.settings.cardStyle.cornerRadius) {
                this.plugin.settings.cardStyle.cornerRadius = {} as CornerRadius;
              }
              this.plugin.settings.cardStyle.cornerRadius[corner] = value;
              await this.plugin.saveSettings();
            })
        );
    });

    containerEl.createEl('h3', { text: 'Typography Settings' });

   // Typography Settings
   ['heading', 'title', 'subtitle', 'body', 'links'].forEach((section) => {
        configureTypographySection(containerEl, capitalizeFirstLetter(section), section as keyof ContentStyle, this.plugin.settings, this.plugin);
    });
   
    containerEl.createEl('h3', { text: 'Image Style Settings' });

    new Setting(containerEl)
      .setName('Image Gradient Overlay')
      .setDesc('Toggle to apply a gradient overlay to the image.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.imageStyle.gradientOverlay || false)
          .onChange(async (value) => {
            this.plugin.settings.imageStyle.gradientOverlay = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Image Position')
      .setDesc('Set the image position')
      .addDropdown((dropdown) => {
        dropdown.addOption('top', 'Top');
        dropdown.addOption('left', 'Left');
        dropdown.addOption('right', 'Right');
        dropdown.addOption('center', 'Center');
        dropdown.addOption('background', 'Background');
        dropdown
          .setValue(this.plugin.settings.imageStyle.position || 'center')
          .onChange(async (value) => {
            this.plugin.settings.imageStyle.position = value as ImagePosition;
            await this.plugin.saveSettings();
          });
    });
    
    new Setting(containerEl)
      .setName('Image Fit')
      .setDesc('Set the image fit')
      .addDropdown((dropdown) =>{
        dropdown.addOption('fit', 'Fit');
        dropdown.addOption('contain', 'Contain');
        dropdown.addOption('cover', 'Cover');
        dropdown.addOption('none', 'None');
        dropdown.addOption('scale-down', 'Scale Down');
        dropdown
          .setValue(this.plugin.settings.imageStyle.fit || 'cover')
          .onChange(async (value) => {
            this.plugin.settings.imageStyle.fit = value as ImageFit;
            await this.plugin.saveSettings();
          });
    });

    // Image Padding
    const paddingKeys: (keyof PaddingStyle)[] =['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    paddingKeys.forEach((side) => {
      new Setting(containerEl)
        .setName(`Image Padding (${side})`)
        .setDesc(`Set the padding for ${side} (e.g., 0px)`)
        .addText((text) =>
          text
            .setPlaceholder('0px')
            .setValue(this.plugin.settings.imageStyle.padding?.[side] || '0px')
            .onChange(async (value) => {
              if (!this.plugin.settings.imageStyle.padding) {
                this.plugin.settings.imageStyle.padding = {};
              }
              this.plugin.settings.imageStyle.padding[side] = value;
              await this.plugin.saveSettings();
            })
        );
    });

    // Enable Resizing
    new Setting(containerEl)
      .setName('Enable Resizing')
      .setDesc('Allow cards to be resizable.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.cardStyle.resizable || false)
          .onChange(async (value) => {
            this.plugin.settings.cardStyle.resizable = value;
            await this.plugin.saveSettings();
          })
      );

    // Horizontal Scroll Toggle
    new Setting(containerEl)
      .setName('Enable Horizontal Scroll')
      .setDesc('Enable horizontal scrolling for the cards.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.horizontalScroll || false)
          .onChange(async (value) => {
            this.plugin.settings.horizontalScroll = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

