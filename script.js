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

  const placeMark = (index, mark) => {

    const markInvalid = mark !== 1 && mark !== 2;
    const indexOutOfRange = index < 0 || index > 8;
    const indexOccupied = board[index] > 0;
    const boardFull = !board.includes(0);

    if (markInvalid || indexOutOfRange) {
      console.error('invalid params');
      return -2;
    }

    if (boardFull) {
      console.error('board full');
      return -1;
    }

    if (indexOccupied) {
      console.error('space occupied');
      return 0;
    }

    board[index] = mark;
    return 1;
  };

  const resetBoard = () => {
    board.fill(0);
  };

  const getStatus = (isX) => {

    if (!board.includes(0)) {
      return 2;
    }

    if (winStates.includes(toIsomorph(isX))) {
      return +isX;
    };

    return -1;
  };

  const toString = () => {

    const c = { 0: '-', 1: 'X', 2: 'O' }

    return `` +
    `${c[board[0]]} ${c(board[1])} ${c[board[2]]}\n` +
    `${c[board[3]]} ${c(board[4])} ${c[board[5]]}\n` +
    `${c[board[6]]} ${c(board[7])} ${c[board[8]]}\n`
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

  return { placeMark, resetBoard, getStatus, toString }
})();

const GameState = (() => {

  let isX = true;
  let state = -1;
  
  const submit = (index) => {
    if (!Gameboard.placeMark(index, isX ? 1 : 2)) return;
    state = Gameboard.getStatus(isX);

    // console.log(Gameboard.toString());

    // switch (state) {
    //   case 0: console.log('O wins'); return;
    //   case 1: console.log('X wins'); return;
    //   case 2: console.log('tie'); return;
    //   default: break;
    // };

    if (state > -1) return;

    isX = !isX;
  };

  const getState = () => state;

  return { submit, getState };
})();