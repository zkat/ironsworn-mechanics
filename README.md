# Ironsworn Mechanics Block Plugin

This plugin renders a [KDL](https://kdl.dev/) block into a formatted
Ironsworn/Starforged mechanics block, with nice styling and all that.

It takes an Obsidian note that looks like this:

<img src="img/mechanics-raw.png" width="800">

and turns it into this:

<img src="img/mechanics-rendered.png" width="800">

## Supported Mechanics

### `move`

Declares a new move. A single `\`\`\`mechanics` block can contain multiple of
these nodes.

Arguments:

- `moveName`: the name of the move

#### Example

````kdl
```mechanics
move "Face Danger" {
	roll action-die=6 stat=3 adds=0 score=9 challenge1=8 challenge2=9
	- "ouch"
}
move "Endure Harm" {
    - "-1 health"
    roll action-die=3 stat=4 adds=0 score=7 challenge1=3 challenge2=5
}
```
````

#### Children

##### `-` (dash)

Adds an "arbitrary" text entry under the move. You can put anything in here.

Arguments:

- `text`: the text to display

Example:

```kdl
- "Oh man that was interesting"
- "+progress on the vow to get macdonalds"
```

##### `roll`

Adds a regular roll to the move.

Properties:

- `action-die`: the value of the action die
- `stat`: the value of the stat to add
- `adds`: the total value of the adds
- `score`: the final score of the roll (clamped to 10)
- `challenge1`: the first challenge die
- `challenge2`: the second challenge die

Example:

```kdl
// This will be rendered as a Weak Hit
roll action-die=3 stat=2 adds=1 score=6 challenge1=3 challenge2=7
```

##### `progress-roll`

Adds a progress roll to the move.

Properties:

- `score`: the number of filled track boxes the progress move is rolling against
- `challenge1`: the first challenge die
- `challenge2`: the second challenge die

Example:

```kdl
// This will render as a Miss on progress
progress-roll score=5 challenge1=6 challenge2=7
```
