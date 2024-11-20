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

    if (markInvalid || indexOutOfRange) {
      console.error('invalid params');
      return moveResponse.bad;
    }

    if (indexOccupied) return moveResponse.occupied;

    board[index] = mark;
    return moveResponse.good;
  };

  const resetBoard = () => {
    board.fill(0);
  };

  const getStatus = (isX) => {
    if (!board.includes(0)) return boardStatus.tie;
    const playerWin = winStates.includes(toIsomorph(isX));
    if (playerWin) return isX ? 
      boardStatus.xWins :
      boardStatus.oWins ;          
    
    return boardStatus.continue;
  };

  const toString = () => {
    const c = [ '-', 'X', 'O' ];
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

  const isTurnX = () => isX;
  const getState = () => state;
  
  const submit = (index) => {
    const marker = isX ? 1 : 2;
    const moveResponse = Gameboard.placeMark(index, marker);
    state = Gameboard.getStatus(isX);
    isX = (state === Gameboard.boardStatus.continue) ? !isX : !isX;
    return moveResponse;
  };

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
      const cellElement = document.getElementById(`cell${i}`);
      cellElement.addEventListener('click', (e) => {
        if (GameState.getState() !== Gameboard.boardStatus.continue) return;
        const cell = e.target;
        const marker = GameState.isTurnX() ? x.cloneNode(true) : o.cloneNode(true);
        const moveResponse = GameState.submit(idToIndex(cell.id));
        if (moveResponse !== Gameboard.moveResponse.good) return;
        cell.appendChild(marker);
      });
    }

    document.querySelector('#x').remove();
    document.querySelector('#o').remove();
  };

  return { attachListeners };
})(document);

Display.attachListeners();