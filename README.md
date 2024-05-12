# Ironsworn Mechanics Plugin

This plugin provides a few utilities and some custom rendering for
Ironsworn-family games, making the experience feel more like a virtual
tabletop.

## Supported Mechanics

### Mechanic Code Fences

This plugin renders a [KDL](https://kdl.dev/) block into a formatted
Ironsworn/Starforged mechanics block, with nice styling and all that.

It takes an Obsidian note that looks like this:

<img src="img/mechanics-raw.png" width="800">

and turns it into this:

<img src="img/mechanics-rendered.png" width="800">

#### `move`

Declares a new move. A single `\`\`\`mechanics` block can contain multiple of
these nodes.

##### Arguments

- `moveName`: the name of the move

##### Example

````kdl
```mechanics
move "Face Danger" {
	roll action=6 stat=3 adds=0 vs1=8 vs2=9
	- "ouch"
}
move "Endure Harm" {
    - "-1 health"
    roll action=3 stat=4 adds=0 vs1=3 vs2=5
}
```
````

#### `-` (dash)

Adds an "arbitrary" text entry under the move. You can put anything in here.

Parent: `move`

##### Arguments

- `text`: the text to display

##### Example

```kdl
- "Oh man that was interesting"
- "+progress on the vow to get macdonalds"
```

#### `roll`

Adds a regular roll to the move.

Parent: `move`

##### Properties

- `action`: the value of the action die
- `stat`: the value of the stat to add
- `adds`: the total value of the adds
- `vs1`: the first challenge die
- `vs2`: the second challenge die

##### Example

```kdl
// This will be rendered as a Weak Hit
roll action-die=3 stat=2 adds=1 score=6 challenge1=3 challenge2=7
```

#### `progress-roll`

Adds a progress roll to the move.

Parent: `move`

##### Properties

- `score`: the number of filled track boxes the progress move is rolling against
- `vs1`: the first challenge die
- `vs2`: the second challenge die

##### Example

```kdl
// This will render as a Miss on progress
progress-roll score=5 challenge1=6 challenge2=7
```

#### `reroll`

Rerolls one or more dice from a previous roll in the same move. The move's
result will be automatically updated.

Parent: `move`

##### Properties

- `action` (optional): the new value of the action die
- `vs1` (optional): the new value of the first challenge die
- `vs2` (optional): the new value of the second challenge die

##### Example

```kdl
move "Face Danger" {
    // weak hit (score = 6)
    roll action=3 stat=2 adds=1 vs1=3 vs2=7

    // strong hit (score = 9)
    reroll action=6 vs1=5
}
```
