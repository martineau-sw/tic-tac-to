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
    if (board[index] > 0) return false;
    board[index] = mark;
    return true;
  };

  const resetBoard = () => {
    board.fill(0);
  };

  const checkWin = (playerX) => {
    
    const string = toIsomorph(playerX);
    if (winStates.includes(string)) 
      return playerX ? 1 : 2;
    for (const win of winStates) {
      let matches = 0;
      for (let i = 0; i < win.length; i++) {
        if(win.at(i) === string.at(i) && win.at(i) === '+') matches++;
      }
      if(matches === 3) return playerX ? 1 : 2;
    }
    if (!board.includes(0)) return 3;
    return 0;
  };

  const toString = () => {
    const c = [ '-', 'X', 'O' ];
    return `` +
    `${c[board[0]]} ${c[board[1]]} ${c[board[2]]}\n` +
    `${c[board[3]]} ${c[board[4]]} ${c[board[5]]}\n` +
    `${c[board[6]]} ${c[board[7]]} ${c[board[8]]}\n`
  };

  function toIsomorph(isX) {
    const iso = board.reduce((string, mark) => {
      let sign = '-';
      if (isX && mark === 1 || !isX && mark === 2) {
        sign = '+';
      } 

      return string + sign;
    }, '');

    console.log(iso);
    return iso;
  };

  return { placeMark, resetBoard, checkWin, toString }
})();

const GameState = (() => {

  let xName;
  let oName;

  const getXName = () => xName;
  const getOName = () => oName;

  const setXName = name => xName = name;
  const setOName = name => oName = name;

  const submit = (index, x) => {
    if(!Gameboard.placeMark(index, x ? 1 : 2)) 
      return { state: -1, playerX: x };
    let winner = Gameboard.checkWin(x)
    if(winner > 0) return { state: winner, playerX: !x };
    return {
      state: 0,
      playerX: !x
    }
  };

  const restart = (frame) => {
    Gameboard.resetBoard();

    if (frame.state === 3) 
      frame.state = Math.random() > 0.5;

    return { state: 0, playerX: !frame.state }
  }

  return { 
    submit, restart, getXName, getOName, 
    setXName, setOName
  };
})();

const Display = (document => {

  let frame;
  const x = document.querySelector('.x').cloneNode(true);
  const o = document.querySelector('.o').cloneNode(true);

  function idToIndex(id) {
    return +(id.slice(4)-1);
  };

  function displayResult() {
    let message;
    switch(frame.state) {
      case 2: 
        message = `${GameState.getXName()} wins!`;
        break;
      case 1:
        message = `${GameState.getOName()} wins!`;
        break;
      case 3:
        message = `It's a tie!`;
        break;
      default:
        message = `Something went wrong :/`;
        break;
    }

    const results = document.querySelector('#results');
    results.querySelector('h2').textContent = message;
    results.showModal();
  }

  function addCellOnClick() {
    for (let i = 1; i < 10; i++) {
      const cellElement = document.getElementById(`cell${i}`);
      cellElement.addEventListener('mousedown', e => {
        frame = GameState.submit(idToIndex(e.target.closest('.cell').id), frame.playerX);
        updateMarker(e.target.closest('.cell'));
      });
    }
  }

  function addNamesOnClick() {
    const x = document.querySelector('#xName');
    const o = document.querySelector('#oName');
    names.addEventListener('submit', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      GameState.setXName(x.value ? x.value : 'X');
      GameState.setOName(o.value ? o.value : 'O');
      e.target.closest('dialog').close();
    });
  }

  function addRestartOnClick() {
    const restart = document.querySelector('#restart');

    restart.addEventListener('click', () => {
      for (const child of document.querySelector('#game').children) 
        if (child.hasChildNodes()) child.firstChild.remove();
      
      GameState.restart(frame);
      results.close();
    });
  }

  function updateMarker(cell) {
    if (frame.state < 0) return;
    if (frame.state > 0) displayResult();
    cell.appendChild(frame.playerX ? 
      x.cloneNode(true) :
      o.cloneNode(true));
  } 

  const attachListeners = () => {
    addNamesOnClick();
    addCellOnClick();
    addRestartOnClick();
  };

  const init = () => {
    frame = { state: 0, playerX: false };
    attachListeners();
    document.querySelector('#names').showModal()
    document.querySelector('.x').remove();
    document.querySelector('.o').remove();
  }

  return { init };
})(document);

Display.init();