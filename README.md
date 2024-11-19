# Project: Tic Tac Toe

Tic Tac Toe project as part of the The Odin Project curriculum.

## Assignment

1. Setup Git repo with HTML, CSS, and JavaScript files
2. Encapsulate game data in objects to minimize global state:
	1. Gameboard
		- Array for game board
	2. Players
	3. Game state
3. Create minimum viable product in console without DOM interaction or user input
	- Identify win/lose/tie states
4. Create object that manipulates DOM
5. Accept user input via DOM
6. Style

## Problem solving

### Understand 

Create a tic tac toe game that's played between two players. Script minimizes global state by leverage closures, factories, and module pattern.

## Plan

- Gameboard object
	- Gameboard array, 9 elements
		- `0` empty
		- `1` player 1
		- `2` player two
	- Validate and mark position
	- Reset board
  - Check win

- Game state
	- Turn
    - Request move and continue if valid
    - Check board status for win / tie, toggle turn if no end and go to next turn
    - End

```
algorithm for win condition:
- store win states as string array 
- reduce board to isomorphic representation for current player's turn
  - if mark is current player turn append +
  - else append -
- check for string match in win state array
- if match current player wins
- else if 0 is present in array continue to next turn
- else tie

1:     4:     7:
+ + +  + - -  + - -
- - -  + - -  - + -
- - -  + - -  - - +

2:     5:     8:
- - -  - + -  - - +
+ + +  - + -  - + -
- - -  - + -  + - -

3:     6:
- - -  - - +
- - -  - - +
+ + +  - - +


1: [ + + + - - - - - - ]
2: [ - - - + + + - - - ]
3: [ - - - - - - + + + ]

4: [ + - - + - - + - - ]
5: [ - + - - + - - + - ]
6: [ - - + - - + - - + ]

7: [ + - - - + - - - + ]
8: [ - - + - + - + - - ]


```