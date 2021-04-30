let grid = [];
let target = 0;
let sum = 0;
let score = 0;
let noOfCols = 6;
let summ = document.getElementById("summ");
summ.innerHTML = "Sum";
document.getElementById("target").innerHTML = target;
document.getElementById("sum").innerHTML = sum;

// *********Update Target Start************
const changetarget = () => {
  target = 10 + parseInt(Math.random() * 30);
  document.getElementById("target").innerHTML = target;
  document.getElementById("time").innerHTML = target;
};
//***************Update target end */

const addarr = () => {
  let arr = [];
  for (let i = 0; i < noOfCols; i++) {
    let obj = {};
    obj.value = parseInt(Math.random() * 9) + 1;
    obj.selected = false;
    arr.push(obj);
  }
  grid.unshift(arr);
};

// ************Game Over Start********/
const gameOver = () => {
  if (grid.length !== noOfCols) {
    return false;
  } else if (grid.length === noOfCols) {
    let i = 5;
    let count = 0;
    for (let j = 0; j < noOfCols; j++) {
      let lastcol = document.getElementById(getId(i, j));

      if (lastcol.innerHTML === "") count++;
    }
    if (count === noOfCols) {
      grid.length -= 1;
      return false;
    }
  }
  document.getElementById("time").classList.remove("timer");
  document.getElementById("time").innerHTML = "";
  return true;
};
//**********Game Over Ends */

/*****Update grid columns innerHtml**** */
const updateinnercol = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let col = document.getElementById(getId(i, j));

      col.innerHTML = grid[i][j].value;
      if (grid[i][j].selected === true) {
        col.classList.add("selected");
      } else if (col.classList.contains("selected")) {
        col.classList.remove("selected");
      }

      if (col.innerHTML !== "" && !col.classList.contains("selected")) {
        col.classList.add("filled");
      } else if (col.innerHTML === "" || col.classList.contains("selected"))
        col.classList.remove("filled");
    }
  }
};

/*******Time interval  */
const settime = () => {
  let id = setInterval(() => {
    addarr();
    updateinnercol();

    if (gameOver()) {
      swal("Game Over!", `Score : ${score}`, "error").then(() => {
        window.location.href = "index.html";
      });
      clearInterval(id);
    }
  }, 5000);
};
const getId = (i, j) => {
  return i.toString() + j.toString();
};

/******grid creation */
const bottomrow = () => {
  let board = document.getElementById("board");
  for (let i = 0; i < noOfCols; i++) {
    let rows = document.createElement("div");

    rows.className = "row";

    for (let j = 0; j < noOfCols; j++) {
      let cols = document.createElement("div");
      cols.className = "col-lg-2";
      cols.classList.add("col-md-2", "col-sm-2", "col-2");

      let innercol = document.createElement("div");
      innercol.classList.add("cols", "center");

      innercol.setAttribute("id", getId(i, j));
      innercol.addEventListener("click", () => handleClick(innercol, i, j));
      cols.appendChild(innercol);
      rows.appendChild(cols);
    }
    board.appendChild(rows);
  }
  changetarget();
  updateScore(0);
};

const updateScore = (score) => {
  document.getElementById("score").innerHTML = `Score : ${score}`;
};
const deSelectAllSelected = () => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].selected = false;
    }
  }
};

const removeAllSelected = () => {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].selected) {
        grid[i][j].value = "";
        grid[i][j].selected = false;

        count++;
      }
    }
  }
  return count;
};
const fillSpace = () => {
  for (let i = 0; i < noOfCols; i++) {
    let j = 0;
    let temp = 0;
    while (j < grid.length) {
      if (grid[j][i].value === "") {
        temp++;
        j++;
      } else {
        if (temp !== 0) {
          grid[j - temp][i].value = grid[j][i].value;
          grid[j][i].value = "";
        }
        j++;
      }
    }
  }
  updateinnercol();
};

const handleClick = (input, i, j) => {
  if (input.innerHTML === "") return;

  grid[i][j].selected = !grid[i][j].selected;
  document.getElementById("audio1").play();
  if (grid[i][j].selected) {
    sum += grid[i][j].value;
  } else {
    sum -= grid[i][j].value;
  }

  if (sum > target) {
    sum = 0;

    deSelectAllSelected();
    document.getElementById("wrong").play();
  } else if (sum === target) {
    document.getElementById("audio2").play();
    let num = removeAllSelected();
    setTimeout(fillSpace, 500);
    score += num;
    updateScore(score);
    changetarget();
    sum = 0;
  }
  document.getElementById("sum").innerHTML = sum;
  summ.innerHTML = "Sum : " + sum;
  updateinnercol();
};

const buttonclicked = () => {
  document.getElementById("bottomrow").classList.remove("hide");
  document.getElementById("btn").classList.add("hide");
  bottomrow();
  settime();
};
