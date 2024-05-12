import { Plugin } from "obsidian";
import { parse, Node as KdlNode } from "kdljs";

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
                    throw new Error(
                        "Failed to parse KDL code for mechanics block."
                    );
                }
                for (const node of doc) {
                    if (node.name.toLowerCase() === "move") {
                        addMove(el, node);
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

function addMove(el: HTMLElement, node: KdlNode) {
    const moveName = node.values[0] as string;
    const moveNode = el.createEl("details", { cls: "ironsworn-mechanic-move" });
    moveNode.createEl("summary", { text: moveName });
    let lastRoll = undefined;
    for (const item of node.children) {
        const name = item.name.toLowerCase();
        switch (name) {
            case "roll": {
                lastRoll = item;
                const action = item.properties["action"] as number;
                const stat = item.properties.stat as number;
                const adds = item.properties.adds as number;
                const score = Math.min(10, action + stat + adds);
                const challenge1 = item.properties["vs1"] as number;
                const challenge2 = item.properties["vs2"] as number;
                moveNode.createEl("p", {
                    cls: "roll",
                    text: "Roll",
                });
                const rollNode = moveNode.createEl("dl", {
                    cls: "roll",
                });
                let outcome;
                if (score > challenge1 && score > challenge2) {
                    rollNode.addClass("strong-hit");
                    setMoveHit(
                        moveNode,
                        "strong-hit",
                        challenge1 === challenge2
                    );
                    outcome = "Strong Hit";
                } else if (score > challenge1 || score > challenge2) {
                    rollNode.addClass("weak-hit");
                    setMoveHit(moveNode, "weak-hit", challenge1 === challenge2);
                    outcome = "Weak Hit";
                } else {
                    rollNode.addClass("miss");
                    setMoveHit(moveNode, "miss", challenge1 === challenge2);
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
                    .setAttribute("data-value", "" + action);
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
                    .setAttribute("data-value", "" + challenge1);
                rollNode.createEl("dt", {
                    text: "Challenge Die 2",
                });
                rollNode
                    .createEl("dd", {
                        cls: "challenge-die",
                        text: "" + challenge2,
                    })
                    .setAttribute("data-value", "" + challenge2);
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
                lastRoll = item;
                const score = item.properties.score as number;
                const challenge1 = item.properties["challenge1"] as number;
                const challenge2 = item.properties["challenge2"] as number;
                moveNode.createEl("p", {
                    cls: "roll",
                    text: "Progress Roll",
                });
                const rollNode = moveNode.createEl("dl", {
                    cls: "roll",
                });
                let outcome;
                if (score > challenge1 && score > challenge2) {
                    rollNode.addClass("strong-hit");
                    setMoveHit(
                        moveNode,
                        "strong-hit",
                        challenge1 === challenge2
                    );
                    outcome = "Strong Hit";
                } else if (score > challenge1 || score > challenge2) {
                    rollNode.addClass("weak-hit");
                    setMoveHit(moveNode, "weak-hit", challenge1 === challenge2);
                    outcome = "Weak Hit";
                } else {
                    rollNode.addClass("miss");
                    setMoveHit(moveNode, "miss", challenge1 === challenge2);
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
                    .setAttribute("data-value", "" + challenge1);
                rollNode.createEl("dt", {
                    text: "Challenge Die 2",
                });
                rollNode
                    .createEl("dd", {
                        cls: "challenge-die",
                        text: "" + challenge2,
                    })
                    .setAttribute("data-value", "" + challenge2);
                rollNode.createEl("dt", {
                    text: "Outcome",
                });
                rollNode.createEl("dd", {
                    cls: "outcome",
                    text: outcome,
                });
                break;
            }
            case "die-roll": {
                const rollNode = moveNode.createEl("dl", {
                    cls: "die-roll",
                });
                const reason = item.values[0] as string;
                const value = item.values[1] as number;
                rollNode.createEl("dt", {
                    text: reason,
                });
                rollNode
                    .createEl("dd", {
                        cls: "",
                        text: "" + value,
                    })
                    .setAttribute("data-value", "" + value);

                break;
            }
            case "reroll": {
                if (!lastRoll) {
                    break;
                }
                moveNode.createEl("p", {
                    cls: "reroll",
                    text: "Reroll"
                });
                const rerollNode = moveNode.createEl("dl", {
                    cls: "reroll",
                });
                const action = lastRoll.properties.action as number | undefined;
                const newScore =
                    item.properties.action != null
                        ? Math.min(
                              (item.properties.action as number) +
                                  (lastRoll.properties.stat as number) +
                                  (lastRoll.properties.adds as number),
                              10
                          )
                        : (lastRoll.properties.score as number);
                const lastVs1 = lastRoll.properties.vs1 as number;
                const lastVs2 = lastRoll.properties.vs2 as number;
                const newVs1 = (item.properties.vs1 ??
                    lastRoll.properties.vs1) as number;
                const newVs2 = (item.properties.vs2 ??
                    lastRoll.properties.vs2) as number;
                let outcome;
                if (newScore > newVs1 && newScore > newVs2) {
                    rerollNode.addClass("strong-hit");
                    setMoveHit(moveNode, "strong-hit", newVs1 === newVs2);
                    outcome = "Strong Hit";
                } else if (newScore > newVs1 || newScore > newVs2) {
                    rerollNode.addClass("weak-hit");
                    setMoveHit(moveNode, "weak-hit", newVs1 === newVs2);
                    outcome = "Weak Hit";
                } else {
                    rerollNode.addClass("miss");
                    setMoveHit(moveNode, "miss", newVs1 === newVs2);
                    outcome = "Miss";
                }
                if (newVs1 === newVs2) {
                    rerollNode.addClass("match");
                    outcome += " (Match)";
                }
                if (item.properties.action != null) {
                    const newAction = item.properties.action as number;
                    lastRoll.properties.action = newAction;
                    rerollNode.createEl("dt", {
                        text: "Old Action Die",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "action-die",
                            text: "" + action,
                        })
                        .setAttribute("data-value", "" + action);
                    rerollNode.createEl("dt", {
                        text: "New Action Die",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "action-die",
                            text: "" + newAction,
                        })
                        .setAttribute("data-value", "" + newAction);
                }
                if (item.properties.vs1 != null) {
                    const newVs1 = item.properties.vs1 as number;
                    lastRoll.properties.vs1 = newVs1;
                    rerollNode.createEl("dt", {
                        text: "Old Challenge Die 1",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "challenge-die",
                            text: "" + lastVs1,
                        })
                        .setAttribute("data-value", "" + lastVs1);
                    rerollNode.createEl("dt", {
                        text: "New Challenge Die 1",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "challenge-die",
                            text: "" + newVs1,
                        })
                        .setAttribute("data-value", "" + newVs1);
                }
                if (item.properties.vs2 != null) {
                    const newVs2 = item.properties.vs2 as number;
                    lastRoll.properties.vs2 = newVs2;
                    rerollNode.createEl("dt", {
                        text: "Old Challenge Die 2",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "old-challenge2",
                            text: "" + lastVs2,
                        })
                        .setAttribute("data-value", "" + lastVs2);
                    rerollNode.createEl("dt", {
                        text: "New Challenge Die 2",
                    });
                    rerollNode
                        .createEl("dd", {
                            cls: "new-challenge2",
                            text: "" + newVs2,
                        })
                        .setAttribute("data-value", "" + newVs2);
                }
                rerollNode.createEl("dt", {
                    text: "New Score",
                });
                rerollNode
                    .createEl("dd", {
                        cls: "score",
                        text: "" + newScore,
                    })
                    .setAttribute("data-value", "" + newScore);
                rerollNode.createEl("dt", {
                    text: "Outcome",
                });
                rerollNode.createEl("dd", {
                    cls: "outcome",
                    text: outcome,
                });
                break;
            }
            case "burn": {
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

function setMoveHit(moveEl: HTMLElement, hitKind: string, match: boolean) {
    switch (hitKind) {
        case "strong-hit": {
            moveEl.classList.toggle("strong-hit", true);
            moveEl.classList.toggle("weak-hit", false);
            moveEl.classList.toggle("miss", false);
            break;
        }
        case "weak-hit": {
            moveEl.classList.toggle("strong-hit", false);
            moveEl.classList.toggle("weak-hit", true);
            moveEl.classList.toggle("miss", false);
            break;
        }
        case "miss": {
            moveEl.classList.toggle("strong-hit", false);
            moveEl.classList.toggle("weak-hit", false);
            moveEl.classList.toggle("miss", true);
            break;
        }
    }
    moveEl.classList.toggle("match", match);
}
