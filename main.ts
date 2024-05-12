import { Plugin } from "obsidian";
import { parse } from "kdljs";

interface IronswornMechanicsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: IronswornMechanicsSettings = {
	mySetting: "default",
};

export default class IRonswornMechanicsPlugin extends Plugin {
	settings: IronswornMechanicsSettings;

	async onload() {
		await this.loadSettings();
		this.registerMarkdownCodeBlockProcessor(
			"mechanics",
			(source, el, ctx) => {
				const doc = parse(source).output;
				if (!doc) {
					throw new Error("Failed to parse KDL code for mechanics block.");
				}
				for (const node of doc) {
					if (node.name.toLowerCase() === "move") {
						const moveName = node.values[0] as string;
						const moveNode = el.createEl("details", { cls: "move" });
						moveNode.createEl("summary", { text: moveName });
						for (const item of node.children) {
							const name = item.name.toLowerCase();
							switch (name) {
								case "roll": {
									const action = item.properties[
										"action-die"
									] as number;
									const stat = item.properties.stat as number;
									const adds = item.properties.adds as number;
									const score = item.properties
										.score as number;
									const challenge1 = item.properties[
										"challenge1"
									] as number;
									const challenge2 = item.properties[
										"challenge2"
									] as number;
									const rollNode = moveNode.createEl("dl", {
										cls: "roll",
									});
									let outcome;
									if (
										score > challenge1 &&
										score > challenge2
									) {
										rollNode.addClass("strong-hit");
										outcome = "Strong Hit";
									} else if (
										score > challenge1 ||
										score > challenge2
									) {
										rollNode.addClass("weak-hit");
										outcome = "Weak Hit";
									} else {
										rollNode.addClass("miss");
										outcome = "Miss";
									}
									if (challenge1 === challenge2) {
										rollNode.addClass("match");
										outcome += " (Match)";
									}
									rollNode.createEl("dt", {
										text: "Action Die",
									});
									rollNode
										.createEl("dd", {
											cls: "action-die",
											text: "" + action,
										})
										.setAttribute(
											"data-value",
											"" + action
										);
									rollNode.createEl("dt", {
										text: "Stat",
									});
									rollNode
										.createEl("dd", {
											cls: "stat",
											text: "" + stat,
										})
										.setAttribute("data-value", "" + stat);
									rollNode.createEl("dt", {
										text: "Adds",
									});
									rollNode
										.createEl("dd", {
											cls: "adds",
											text: "" + adds,
										})
										.setAttribute("data-value", "" + adds);
									rollNode.createEl("dt", {
										text: "Score",
									});
									rollNode
										.createEl("dd", {
											cls: "score",
											text: "" + score,
										})
										.setAttribute("data-value", "" + score);
									rollNode.createEl("dt", {
										text: "Challenge Die 1",
									});
									rollNode
										.createEl("dd", {
											cls: "challenge-die",
											text: "" + challenge1,
										})
										.setAttribute(
											"data-value",
											"" + challenge1
										);
									rollNode.createEl("dt", {
										text: "Challenge Die 2",
									});
									rollNode
										.createEl("dd", {
											cls: "challenge-die",
											text: "" + challenge2,
										})
										.setAttribute(
											"data-value",
											"" + challenge2
										);
									rollNode.createEl("dt", {
										text: "Outcome",
									});
									rollNode.createEl("dd", {
										cls: "outcome",
										text: outcome,
									});
									break;
								}
								case "progress-roll": {
									const score = item.properties
										.score as number;
									const challenge1 = item.properties[
										"challenge1"
									] as number;
									const challenge2 = item.properties[
										"challenge2"
									] as number;
									const rollNode = moveNode.createEl("dl", {
										cls: "roll",
									});
									let outcome;
									if (
										score > challenge1 &&
										score > challenge2
									) {
										rollNode.addClass("strong-hit");
										outcome = "Strong Hit";
									} else if (
										score > challenge1 ||
										score > challenge2
									) {
										rollNode.addClass("weak-hit");
										outcome = "Weak Hit";
									} else {
										rollNode.addClass("miss");
										outcome = "Miss";
									}
									if (challenge1 === challenge2) {
										rollNode.addClass("match");
										outcome += " (Match)";
									}
									rollNode.createEl("dt", {
										text: "Progress Score",
									});
									rollNode
										.createEl("dd", {
											cls: "progress-score",
											text: "" + score,
										})
										.setAttribute("data-value", "" + score);
									rollNode.createEl("dt", {
										text: "Challenge Die 1",
									});
									rollNode
										.createEl("dd", {
											cls: "challenge-die",
											text: "" + challenge1,
										})
										.setAttribute(
											"data-value",
											"" + challenge1
										);
									rollNode.createEl("dt", {
										text: "Challenge Die 2",
									});
									rollNode
										.createEl("dd", {
											cls: "challenge-die",
											text: "" + challenge2,
										})
										.setAttribute(
											"data-value",
											"" + challenge2
										);
									rollNode.createEl("dt", {
										text: "Outcome",
									});
									rollNode.createEl("dd", {
										cls: "outcome",
										text: outcome,
									});
									break;
								}
								case "-": {
									moveNode.createEl("p", {
										text: item.values[0] as string,
										cls: "detail",
									});
									break;
								}
							}
						}
					}
				}
			}
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
