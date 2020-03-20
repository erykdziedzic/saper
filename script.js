/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable no-console */

// const win;
const empty = [];
const borders = [];
let values = [];
let mines = [];
let rows = 0;
let cols = 0;
let time = 0;
let startTimer = false;
let cellsLeft = 0;
let minesLeft = 0;
let realMinesLeft = 0;

const compare = (a, b) => {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
};

const filled = () => {
  if (
    document.getElementById('height').value === ''
    || document.getElementById('width').value === ''
    || document.getElementById('mines').value === ''
  ) {
    alert('Wpisz wszystkie wartości!');
    return false;
  }
  return true;
};

function createTimer() {
  time = 0;
  startTimer = true;
  const timer = setInterval(() => {
    if (!startTimer) {
      clearInterval(timer);
      startTimer = false;
    } else {
      time += 1;
      if (document.getElementById('timeLeft')) {
        const minutes = Math.floor(time / 60);
        if (minutes > 0) {
          document.getElementById('timeLeft')
            .textContent = `Grasz: ${minutes}min ${time - minutes * 60}s`;
        } else {
          document.getElementById('timeLeft')
            .textContent = `Grasz: ${time}s`;
        }
      }
    }
  }, 1000);
  const timeLeft = document.createElement('div');
  timeLeft.id = 'timeLeft';
  timeLeft.className = 'stats';
  timeLeft.textContent = 'Grasz: 0s';
  if (document.getElementById('timeLeft')) {
    document.getElementById('timeLeft').remove();
  }
  return timeLeft;
}

function createCounter() {
  if (document.getElementById('minesLeft')) {
    document.getElementById('minesLeft').remove();
  }
  minesLeft = Number(document.getElementById('mines').value);
  realMinesLeft = minesLeft;
  const minesLeftDiv = document.createElement('div');
  minesLeftDiv.id = 'minesLeft';
  minesLeftDiv.className = 'stats';
  minesLeftDiv.textContent = `Pozostało bomb: ${minesLeft}`;
  return minesLeftDiv;
}

function createOption(name, value=5) {
  const option = document.createElement('div');
  option.className = 'option';
  option.id = `${name}Option`;
  const input = document.createElement('input');
  input.value = value;
  input.id = name.toLowerCase();
  input.oninput = (e) => {
    if (isNaN(e.data)) {
      setTimeout(() => {
        input.value = '';
      }, 500);
    }
  };

  const label = document.createElement('label');
  label.htmlFor = name.toLowerCase();
  label.innerHTML = name;
  option.appendChild(label);
  option.appendChild(input);

  return option;
}

const emptyFound = (row, col) => empty.map((e) => JSON.stringify(e))
  .includes(JSON.stringify({ row, col }));

const findEmptyAround = (row, col) => {
  rows = values.length;
  cols = values[0].length;
  const firstCol = col === 0;
  const firstRow = row === 0;
  const lastCol = col === cols - 1;
  const lastRow = row === rows - 1;

  empty.push({ row, col });
  document.getElementById(`i_${row}_${col}`).onclick = () => {};

  if (!firstRow && values[row - 1][col] === 0 && !emptyFound(row - 1, col)) {
    findEmptyAround(row - 1, col, values);
  }

  if (
    !lastRow && values[row + 1][col] === 0 && !emptyFound(row + 1, col)) {
    findEmptyAround(row + 1, col, values);
  }

  if (!firstCol && values[row][col - 1] === 0 && !emptyFound(row, col - 1)) {
    findEmptyAround(row, col - 1, values);
  }

  if (
    !lastCol && values[row][col + 1] === 0 && !emptyFound(row, col + 1)
  ) {
    findEmptyAround(row, col + 1, values);
  }

  const borderFound = (borderRow, borderCol) => borders.map((e) => JSON.stringify(e))
    .includes(JSON.stringify({ borderRow, borderCol }));

  if (
    !lastCol && !lastRow
    && !borderFound(row + 1, col + 1)
    && !emptyFound(row + 1, col + 1)
  ) {
    borders.push({ row: row + 1, col: col + 1 });
  }
  if (
    !lastRow
    && !borderFound(row + 1, col)
    && !emptyFound(row + 1, col)
  ) {
    borders.push({ row: row + 1, col });
  }
  if (
    !lastRow && !firstCol
    && !borderFound(row + 1, col - 1)
    && !emptyFound(row + 1, col - 1)
  ) {
    borders.push({ row: row + 1, col: col - 1 });
  }

  if (
    !lastCol
    && !borderFound(row, col + 1)
    && !emptyFound(row, col + 1)) {
    borders.push({ row, col: col + 1 });
  }
  if (
    !firstCol
    && !borderFound(row, col - 1)
    && !emptyFound(row, col - 1)) {
    borders.push({ row, col: col - 1 });
  }

  if (
    !firstRow && !lastCol
    && !borderFound(row - 1, col + 1)
    && !emptyFound(row - 1, col + 1)) {
    borders.push({ row: row - 1, col: col + 1 });
  }
  if (
    !firstRow
    && !borderFound(row - 1, col)
    && !emptyFound(row - 1, col)) {
    borders.push({ row: row - 1, col });
  }
  if (
    !firstRow && !firstCol
    && !borderFound(row - 1, col - 1)
    && !emptyFound(row - 1, col - 1)) {
    borders.push({ row: row - 1, col: col - 1 });
  }
};

const colorForFieldValue = (value) => {
  switch (value) {
    case 1:
      return 'blue';
    case 2:
      return 'green';
    case 3:
      return 'red';
    case 4:
      return 'purple';
    case 5:
      return 'maroon';
    case 6:
      return 'teal';
    case 7:
      return 'black';
    case 8:
      return 'grey';
    default:
      return '#0000';
  }
};

function updateWinnersTable() {
  if (document.getElementById('winners')) {
    const winnersDiv = document.getElementById('winners');
    winnersDiv.innerHTML = '';
    const winners = JSON.parse(document.cookie);
    winners.sort(compare);
    winners.forEach((record, index) => {
      const element = document.createElement('p');
      const minutes = Math.floor(record.time / 60);
      let seconds = record.time - minutes * 60;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      const formattedTime = `${minutes}:${seconds}`;
      element.textContent = `${index + 1}. ${record.nick} - ${formattedTime}`;
      winnersDiv.append(element);
    });
  }
}

function gameWon() {
  setTimeout(() => {
    startTimer = false;
    const alertDiv = document.createElement('div');
    alertDiv.classList = 'alert';
    alertDiv.textContent = 'Wygrałeś!';
    document.body.append(alertDiv);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cell = document.getElementById(`i_${row}_${col}`);
        cell.onclick = null;
        cell.oncontextmenu = null;
        cell.disabled = true;
      }
    }
    const nick = prompt('Podaj nick: ');
    const winners = JSON.parse(document.cookie);
    winners.push({ nick, time });
    winners.sort(compare);
    if (winners.length - 10 > 0) {
      winners.pop();
    }
    document.cookie = JSON.stringify(winners);
    updateWinnersTable();
  }, 100);
}

function gameLost() {
  setTimeout(() => {
    startTimer = false;
    const alertDiv = document.createElement('div');
    alertDiv.classList = 'alert';
    alertDiv.textContent = 'Przegrałeś!';
    document.body.append(alertDiv);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const cell = document.getElementById(`i_${row}_${col}`);
        cell.onclick = null;
        cell.oncontextmenu = null;
        cell.disabled = true;
      }
    }
  }, 100);
}

function updateMinesLeft(x) {
  minesLeft += x;
  return minesLeft > 0 ? minesLeft : 0;
}

const cellClick = (cellId, row, col) => {
  const cell = document.getElementById(cellId);
  if (mines[row][col] === 1) {
    cell.classList.remove(cell.classList[1]);
    mines.forEach((arr, bombRow) => arr.forEach((value, bombCol) => {
      if (value === 1) {
        const bomb = document.getElementById(`i_${bombRow}_${bombCol}`);
        bomb.classList.remove(bomb.classList[1]);
        bomb.classList.add('bomb');
      }
    }));
    gameLost(rows, cols);
  } else {
    const value = values[row][col];
    cell.style.background = 'none';
    cell.classList.add('discovered');
    cell.textContent = value === 0 ? '' : String(value);
    cell.style.color = colorForFieldValue(value);

    if (value === 0) {
      findEmptyAround(row, col, values);

      empty.forEach((e) => {
        const emptyCell = document.getElementById(`i_${e.row}_${e.col}`);
        emptyCell.style.background = 'none';
        emptyCell.textContent = '';
        emptyCell.classList.add('discovered');
      });
      const emptyLen = empty.length;
      for (let i = 0; i < emptyLen; i += 1) {
        empty.pop();
      }

      borders.forEach((e) => {
        const borderCell = document.getElementById(`i_${e.row}_${e.col}`);
        borderCell.style.background = 'none';
        borderCell.textContent = String(values[e.row][e.col]);
        borderCell.style.color = colorForFieldValue(values[e.row][e.col]);
        borderCell.classList.add('discovered');
      });
      const bordersLen = borders.length;
      for (let i = 0; i < bordersLen; i += 1) {
        borders.pop();
      }
    }
    const plateLen = document.getElementsByClassName('discovered').length;
    cellsLeft = rows * cols - plateLen;
    if (cellsLeft === realMinesLeft) {
      mines.forEach((arr, bombRow) => arr.forEach((val, bombCol) => {
        if (val === 1) {
          const bomb = document.getElementById(`i_${bombRow}_${bombCol}`);
          bomb.classList.remove(bomb.classList[1]);
          bomb.classList.add('markedBomb');
        }
      }));
      gameWon();
    }
  }
};

const createTable = () => {
  const cellWidth = 20;
  const table = document.createElement('div');
  table.id = 'table';
  table.style.width = `${cellWidth * cols}px`;
  table.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cell = document.createElement('button');
      cell.id = `i_${row}_${col}`;
      cell.classList.add('cell');
      cell.classList.add('plate');
      cell.onclick = () => cellClick(cell.id, row, col);
      cell.oncontextmenu = () => {
        switch (cell.classList[1]) {
          case 'plate': {
            cell.classList.remove('plate');
            cell.classList.add('flag');
            cell.onclick = () => { };
            document.getElementById('minesLeft').textContent = `Pozostało bomb: ${updateMinesLeft(-1)}`;
            break;
          }
          case 'flag': {
            cell.classList.remove('flag');
            cell.classList.add('questionMark');
            cell.onclick = () => { };
            document.getElementById('minesLeft').textContent = `Pozostało bomb: ${updateMinesLeft(1)}`;
            break;
          }
          case 'questionMark': {
            cell.classList.remove('questionMark');
            cell.classList.add('plate');
            cell.onclick = () => cellClick(cell.id, row, col);
            break;
          }
          default:
            break;
        }
      };
      table.appendChild(cell);
    }
  }
  return table;
};

const createField = () => {
  values = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  mines = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
  for (let i = 0; i < minesLeft; i += 1) {
    const rowIndex = Math.floor(Math.random() * rows);
    const colIndex = Math.floor(Math.random() * cols);

    if (mines[rowIndex][colIndex] === 1) {
      i -= 1;
    } else {
      mines[rowIndex][colIndex] = 1;

      if (rowIndex !== 0) {
        if (colIndex !== 0) {
          values[rowIndex - 1][colIndex - 1] += 1;
        }
        values[rowIndex - 1][colIndex] += 1;
        if (colIndex !== cols - 1) {
          values[rowIndex - 1][colIndex + 1] += 1;
        }
      }

      if (colIndex !== 0) {
        values[rowIndex][colIndex - 1] += 1;
      }
      if (colIndex !== cols - 1) {
        values[rowIndex][colIndex + 1] += 1;
      }

      if (rowIndex !== rows - 1) {
        if (colIndex !== 0) {
          values[rowIndex + 1][colIndex - 1] += 1;
        }
        values[rowIndex + 1][colIndex] += 1;
        if (colIndex !== cols - 1) {
          values[rowIndex + 1][colIndex + 1] += 1;
        }
      }
    }
  }
};

function createWinnersTable() {
  if (document.getElementById('winners')) {
    document.getElementById('winners').remove();
  }
  if (document.cookie === '') {
    document.cookie = '[]';
  }
  const winners = JSON.parse(document.cookie);
  const winnersDiv = document.createElement('div');
  winnersDiv.id = 'winners';

  winners.sort(compare);
  winners.forEach((record, index) => {
    const element = document.createElement('p');
    element.textContent = `${index + 1}. ${record.nick} - ${record.time}`;
    winnersDiv.append(element);
  });
  return winnersDiv;
}

function createGame() {
  rows = Number(document.getElementById('height').value);
  cols = Number(document.getElementById('width').value);
  minesLeft = Number(document.getElementById('mines').value);
  cellsLeft = rows * cols;
  createField();
  const table = createTable();
  if (document.getElementById('table')) {
    document.getElementById('table').remove();
  }
  const alerts = document.getElementsByClassName('alert');
  while (alerts[0]) {
    alerts[0].remove();
  }
  document.body.appendChild(table);
}

function createMenu() {
  const settings = document.createElement('div');
  settings.id = 'settings';

  const generate = document.createElement('button');
  generate.id = 'generate';
  generate.textContent = 'generuj'.toUpperCase();

  settings.appendChild(createOption('Height'));
  settings.appendChild(createOption('Width'));
  settings.appendChild(createOption('Mines'));
  settings.appendChild(generate);

  const heightEl = settings.children[0].children[1];
  const widthEl = settings.children[1].children[1];
  const minesEl = settings.children[2].children[1];
  heightEl.oninput = (e) => {
    minesEl.max = Number(widthEl.value) * Number(heightEl.value); 
    if (isNaN(e.data)) {
      setTimeout(() => {
        heightEl.value = '';
      }, 500);
    }
  }
  widthEl.oninput = (e) => {
    minesEl.max = Number(widthEl.value) * Number(heightEl.value); 
    if (isNaN(e.data)) {
      setTimeout(() => {
        widthEl.value = '';
      }, 500);
    }
  }

  generate.onclick = () => {
    if (filled()) {
      settings.appendChild(createTimer());
      settings.appendChild(createCounter());
      createGame();
    }
  };

  settings.appendChild(createWinnersTable());
  document.body.appendChild(settings);
}

window.onload = () => {
  createMenu();
};
