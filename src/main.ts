import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import parseMechanicsBlocks from "./mechanicsBlocks";

interface IronswornMechanicsSettings {
    mySetting: string;
    toggleMe: boolean;
}

const DEFAULT_SETTINGS: IronswornMechanicsSettings = {
    mySetting: "default",
    toggleMe: false,
};

export default class IronswornMechanicsPlugin extends Plugin {
    settings: IronswornMechanicsSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new IronswornMechanicsSettingTab(this.app, this));

        this.registerMarkdownCodeBlockProcessor(
            "mechanics",
            parseMechanicsBlocks
        );
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class IronswornMechanicsSettingTab extends PluginSettingTab {
    plugin: IronswornMechanicsPlugin;

    constructor(app: App, plugin: IronswornMechanicsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Toggle Me")
            .setDesc("On and Off")
            .addToggle((toggle) => {
            toggle
                .setValue(this.plugin.settings.toggleMe)
                .onChange(async (value) => {
                    this.plugin.settings.toggleMe = value;
                    await this.plugin.saveSettings();
                });
        });

        new Setting(containerEl)
            .setName("Setting #1")
            .setDesc("It's a secret")
            .addText((text) =>
                text
                    .setPlaceholder("Enter your secret")
                    .setValue(this.plugin.settings.mySetting)
                    .onChange(async (value) => {
                        this.plugin.settings.mySetting = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
