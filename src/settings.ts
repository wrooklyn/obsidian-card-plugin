import {PluginSettingTab, Setting } from 'obsidian';
import { GlobalSettings } from './interfaces/SettingsInterfaces';
import CardViewPlugin from 'main';
import { ContentStyle, CornerRadius, marginStyle } from 'interfaces/CommonStyleInterfaces';
import { ImageFit, ImagePosition } from 'utils/types';
import { capitalizeFirstLetter, configureTypographySection} from 'utils/utils';

// Default settings
export const DEFAULT_SETTINGS: GlobalSettings = {
  cardStyle: {
    height: '300px',
    width: '200px',
    backgroundColor: '#F8F8FF',
    cornerRadius: {
      topLeft: '8px',
      topRight: '8px',
      bottomLeft: '8px',
      bottomRight: '8px',
    },
    resizable: false,
  },
  imageStyle: {
    position: 'center',
    fit: 'cover',
    margin: {
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
    },
    cornerRadius: {
      topLeft: '0px',
      topRight: '0px',
      bottomLeft: '0px',
      bottomRight: '0px',
    },
    gradientOverlay: false,
  },
  contentStyle: {
    heading: {
      level: 'body-md',
      font: 'Karla',
      fontWeight: 'regular',
      fontSize: '12px',
      color: '#707070',
      margin: {
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px', 
        marginTop: '0px'
      }
    },
    title: {
      level: 'title-lg',
      font: 'Encode Sans SC',
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#000000',
      margin: {
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px', 
        marginTop: '0px'
      }
    },
    subtitle: {
      level: 'body-md',
      font: 'Assistant',
      fontWeight: 'regular',
      fontSize: '11px',
      color: '#707070',
      margin: {
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px', 
        marginTop: '0px'
      }
    },
    body: {
      level: 'body-md',
      font: 'Karla',
      fontWeight: 'regular',
      fontSize: '11px',
      color: '#707070',
      margin: {
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px', 
        marginTop: '0px'
      }
    },
    links: {
      level: 'body-md',
      font: 'Karla',
      fontWeight: 'regular',
      fontSize: '12px',
      color: '#39383A',
      margin: {
        marginLeft: '16px',
        marginRight: '16px',
        marginBottom: '0px', 
        marginTop: '0px'
      }
    },
  },
  horizontalScroll: false, 
};

// The Settings Tab
export class CardViewSettingTab extends PluginSettingTab {
  plugin: CardViewPlugin;

  constructor(plugin: CardViewPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Card Plugin Settings' });

    containerEl.createEl('h3', { text: 'Card Settings' });

    console.log("DEFAULT, ", DEFAULT_SETTINGS);
    // Card Style Settings
    new Setting(containerEl)
      .setName('Card Height')
      .setDesc('Set the height for the card (e.g., 200px)')
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.cardStyle.height!)
          .setValue(this.plugin.settings.cardStyle.height || DEFAULT_SETTINGS.cardStyle.height!)
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
          .setPlaceholder(DEFAULT_SETTINGS.cardStyle.width!)
          .setValue(this.plugin.settings.cardStyle.width || DEFAULT_SETTINGS.cardStyle.width!)
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
          .setPlaceholder(DEFAULT_SETTINGS.cardStyle.backgroundColor!)
          .setValue(this.plugin.settings.cardStyle.backgroundColor || DEFAULT_SETTINGS.cardStyle.backgroundColor!)
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
            .setPlaceholder(DEFAULT_SETTINGS.cardStyle.cornerRadius?.[corner]!)
            .setValue(this.plugin.settings.cardStyle.cornerRadius?.[corner] || DEFAULT_SETTINGS.cardStyle.cornerRadius?.[corner]!)
            .onChange(async (value) => {
              if (!this.plugin.settings.cardStyle.cornerRadius) {
                this.plugin.settings.cardStyle.cornerRadius = {} as CornerRadius;
              }
              this.plugin.settings.cardStyle.cornerRadius[corner] = value;
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
        .setValue(this.plugin.settings.cardStyle.resizable || DEFAULT_SETTINGS.cardStyle.resizable!)
        .onChange(async (value) => {
          this.plugin.settings.cardStyle.resizable = value;
          await this.plugin.saveSettings();
        })
    );

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
          .setValue(this.plugin.settings.imageStyle.gradientOverlay || DEFAULT_SETTINGS.imageStyle.gradientOverlay!)
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
          .setValue(this.plugin.settings.imageStyle.position || DEFAULT_SETTINGS.imageStyle.position!)
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
          .setValue(this.plugin.settings.imageStyle.fit || DEFAULT_SETTINGS.imageStyle.fit!)
          .onChange(async (value) => {
            this.plugin.settings.imageStyle.fit = value as ImageFit;
            await this.plugin.saveSettings();
          });
    });

    // Image margin
    const marginKeys: (keyof marginStyle)[] =['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    marginKeys.forEach((side) => {
      new Setting(containerEl)
        .setName(`Image margin (${side})`)
        .setDesc(`Set the margin for ${side} (e.g., 0px)`)
        .addText((text) =>
          text
            .setPlaceholder(DEFAULT_SETTINGS.imageStyle.margin?.[side]!)
            .setValue(this.plugin.settings.imageStyle.margin?.[side] || DEFAULT_SETTINGS.imageStyle.margin?.[side]!)
            .onChange(async (value) => {
              if (!this.plugin.settings.imageStyle.margin) {
                this.plugin.settings.imageStyle.margin = {};
              }
              this.plugin.settings.imageStyle.margin[side] = value;
              await this.plugin.saveSettings();
            })
        );
    });

    cornerKeys.forEach((corner) => {
      new Setting(containerEl)
        .setName(`Corner Radius (${corner})`)
        .setDesc(`Set the images corner radius for ${corner} (e.g., 8px)`)
        .addText((text) =>
          text 
            .setPlaceholder(DEFAULT_SETTINGS.imageStyle.cornerRadius?.[corner]!)
            .setValue(this.plugin.settings.imageStyle.cornerRadius?.[corner] || DEFAULT_SETTINGS.imageStyle.cornerRadius?.[corner]!)
            .onChange(async (value) => {
              if (!this.plugin.settings.imageStyle.cornerRadius) {
                this.plugin.settings.imageStyle.cornerRadius = {} as CornerRadius;
              }
              this.plugin.settings.imageStyle.cornerRadius[corner] = value;
              await this.plugin.saveSettings();
            })
        );
    });
    containerEl.createEl('h3', { text: 'General Settings' });

    // Horizontal Scroll Toggle
    new Setting(containerEl)
      .setName('Enable Horizontal Scroll')
      .setDesc('Enable horizontal scrolling for the cards.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.horizontalScroll || DEFAULT_SETTINGS.horizontalScroll)
          .onChange(async (value) => {
            this.plugin.settings.horizontalScroll = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

