const Gameboard = (() => {

  const board = [
    0, 0, 0, 
    0, 0, 0, 
    0, 0, 0,
  ];

  const winStates = [
    "+++------", "---+++---", "------+++",
    "+--+--+--", "-+--+--+-", "--+--+--+",
    "+---+---+", "--+-+-+--"
  ];

  const moveResponse = {
    bad: -1,
    occupied: 0, 
    good: 1
  };

  const boardStatus = {
    continue: 0,
    xWins: 1,
    oWins: 2,
    tie: 3
  }

  const placeMark = (index, mark) => {

    const markInvalid = mark !== 1 && mark !== 2;
    const indexOutOfRange = index < 0 || index > 8;
    const indexOccupied = board[index] > 0;

    // my bad
    if (markInvalid || indexOutOfRange) {
      console.error('invalid params');
      return moveResponse.bad;
    }

    // occupied
    if (indexOccupied) {
      console.error('space occupied');
      return moveResponse.occupied;
    }

    // valid move
    board[index] = mark;
    return moveResponse.good;
  };

  const resetBoard = () => {
    board.fill(0);
  };

  const getStatus = (isX) => {
    // tie
    if (!board.includes(0)) {
      return boardStatus.tie;
    }

    const playerWin = winStates.includes(toIsomorph(isX));
    
    if (playerWin) {
      return isX ? 
        boardStatus.xWins :
        boardStatus.oWins ;          
    }

    // continue
    return boardStatus.continue;
  };

  const toString = () => {

    const c = { 0: '-', 1: 'X', 2: 'O' }

    return `` +
    `${c[board[0]]} ${c[board[1]]} ${c[board[2]]}\n` +
    `${c[board[3]]} ${c[board[4]]} ${c[board[5]]}\n` +
    `${c[board[6]]} ${c[board[7]]} ${c[board[8]]}\n`
  };

  const toIsomorph = isX => {
    return board.reduce((string, mark) => {

      const toSign = () => {
        return isX ?
          mark === 1 ? '+' : '-' :
          mark === 2 ? '+' : '-' ;
      };

      return string + toSign();
    }, '');
  };

  return { moveResponse, boardStatus, placeMark, resetBoard, getStatus, toString }
})();

const GameState = (() => {

  let isX = true;
  let state = Gameboard.boardStatus.continue;
  
  const submit = (index) => {
    const marker = isX ? 1 : 2;
    const moveResponse = Gameboard.placeMark(index, marker);
    state = Gameboard.getStatus(isX);
    if (state === Gameboard.boardStatus.continue) isX = !isX;
    return moveResponse;
  };

  const isTurnX = () => isX;
  const getState = () => state;

  return { submit, getState, isTurnX };
})();

const Display = ((document) => {


  const idToIndex = (id) => {
    return +(id.slice(4)-1);
  };

  const attachListeners = () => {
    const x = document.querySelector('#x').cloneNode(true);
    const o = document.querySelector('#o').cloneNode(true);
    for (let i = 1; i < 10; i++) {
      const cellId = `cell${i}`;
      const cellElement = document.getElementById(cellId);
      cellElement.addEventListener('click', (e) => {
        if (GameState.getState() !== Gameboard.boardStatus.continue) return;
        const isX = GameState.isTurnX();
        const moveResponse = GameState.submit(idToIndex(e.target.id));
        console.log(GameState.getState(), isX, moveResponse);
        if (moveResponse === Gameboard.moveResponse.good) {
            if (isX) {
              e.target.appendChild(x.cloneNode(true));
              return;
            }
            e.target.appendChild(o.cloneNode(true)) ;
        }
        
      });
    }
    document.querySelector('#x').remove();
    document.querySelector('#o').remove();
  };

  return { attachListeners };
})(document);

Display.attachListeners();