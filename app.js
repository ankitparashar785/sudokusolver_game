document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
   // localStorage.setItem('darkmode', isDarkMode);
    // chang mobile status bar color
    var g=document.getElementById("mode");
    if(isDarkMode)
     g.innerHTML="Light Mode";
     else
     g.innerHTML="Dark Mode";
    document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});

// initial value

// screens
const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
// ----------
const cells = document.querySelectorAll('.main-grid-cell');

const name_input = document.querySelector('#input-name');

const number_inputs = document.querySelectorAll('.number');

const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');

const result_time = document.querySelector('#result-time');

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

let timer = null;
let pause = false;
let seconds = 0;

let su = undefined;
let su_answer = undefined;

let selected_cell = -1;

// --------

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));
let newObject = window.localStorage.getItem("game");
// add space for each 9 cells
const initGameGrid = () => {
    let index = 0;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++) {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5) cells[index].style.marginBottom = '10px';
        if (col === 2 || col === 5) cells[index].style.marginRight = '10px';

        index++;
    }
}
 //color array
 const colour=["yellow","gold","salmon","megenta","greenyellow","cyan","orange","deepSkyBlue","aquamarine"];
 // ----------------

const setPlayerName = (name) => localStorage.setItem('player_name', name);
const getPlayerName = () => localStorage.getItem('player_name');

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

const initSudoku = () => {
    // clear old sudoku
    clearSudoku();
    resetBg();
    // generate sudoku puzzle here
    su = sudokuGen(level);
    //console.log(level)
    su_answer = [...su.question];
    //console.table(...su.original)
    seconds = 0;

    saveGameInfo();

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        
        cells[i].setAttribute('data-value', su.question[row][col]);

        if (su.question[row][col] !== 0) {
           cells[i].classList.add('filled');
           
            cells[i].style.backgroundColor=colour[su.question[row][col]];
            cells[i].innerHTML = su.question[row][col];
        }
    }
}

const loadSudoku = () => {
    let game = getGameInfo();

    game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level];

    su = game.su;

    su_answer = su.answer;

    seconds = game.seconds;
    game_time.innerHTML = showTime(seconds);

    level_index = game.level;

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        
       cells[i].setAttribute('data-value', su_answer[row][col]);
       cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : '';
        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled');
        }
    }
}

const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    xcor=row;
    ycor=col;
  //  console.log([row,col])
    tg.innerHTML="Hint";
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
        }
    }

    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
     while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

const resetBg = () => {
    cells.forEach(e => e.classList.remove('hover'));
}

let error=false;
const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
           // cell.innerHTML='';
            error=true;
           // return true;
            setTimeout(() => {
                cell.classList.remove('cell-err');

            }, 500);
        }
        
    
        
    }

    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) 
            {
               addErr(cell);
              //  error=true;
            }
        }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < 9*row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}

const removeErr = () => cells.forEach(e => e.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem('game', JSON.stringify(game));
}

const removeGameInfo = () => {
    localStorage.removeItem('game');
    document.querySelector('#btn-continue').style.display = 'none';
}

const isGameWin = () => sudokuCheck(su_answer);

const showResult = () => {
    clearInterval(timer);
    result_screen.classList.add('active');
    result_time.innerHTML = showTime(seconds);
}
function myFuntionFor(){
    cells[selected_cell].innerHTML='';
}
let xcor=-1;
let ycor=-1;
const initNumberInputEvent = () => {
  number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!cells[selected_cell].classList.contains('filled')) {
               // console.log(index)
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute('data-value', index + 1);
                // add to answer
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index + 1;
                // save game
                 saveGameInfo()
                // -----
               // console.log(selected_cell)
                
              //  console.log([xcor,ycor]);
                removeErr();
                checkErr(index + 1)
                if(error)
                {
                //cells[selected_cell].style.backgroundColor="red";
                  setTimeout(myFuntionFor,1000);
               }
                else{
                    cells[selected_cell].innerHTML = index + 1;
                }
                //console.log(error)
                error=false;
                
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                }, 500);
                 tg.innerHTML="Hint";
                // check game win
                if (isGameWin()) {
                    removeGameInfo();
                    showResult();
                }
                // ----
            };
            
            
        })
    })
    
}

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        })
    })
}

const startGame = () => {
    start_screen.classList.remove('active');
    game_screen.classList.add('active');

    player_name.innerHTML = name_input.value.trim();
    setPlayerName(name_input.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    showTime(seconds);

    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);
}

const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    pause_screen.classList.remove('active');
    result_screen.classList.remove('active');
}

// add button event
document.querySelector('#btn-level').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

document.querySelector('#btn-play').addEventListener('click', () => {
    
    let newObjec = window.localStorage.getItem("myObj");
   // console.log(JSON.parse(newObjec));

    if (name_input.value.trim().length > 0) {
        initSudoku();
        playMusic();
        startGame();
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});

document.querySelector('#btn-continue').addEventListener('click', () => {
    if (name_input.value.trim().length > 0) {
        loadSudoku();
        startGame();
    } else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});

document.querySelector('#btn-pause').addEventListener('click', () => {
    pause_screen.classList.add('active');
    stopMusic();
    
    pause = true;
});

document.querySelector('#btn-resume').addEventListener('click', () => {
    pause_screen.classList.remove('active');
    playMusic();
    if(isSolve)
    pause=true;
    else
    pause = false;
});

document.querySelector('#btn-new-game').addEventListener('click', () => {
    returnStartScreen();
});

document.querySelector('#btn-new-game-2').addEventListener('click', () => {
    console.log('object')
    returnStartScreen();
});

document.querySelector('#btn-delete').addEventListener('click', () => {
    cells[selected_cell].innerHTML = '';
    cells[selected_cell].setAttribute('data-value', 0);

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;

    su_answer[row][col] = 0;

    removeErr();
})
// -------------

const init = () => {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    document.body.classList.add(darkmode ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"').setAttribute('content', darkmode ? '#1a1a2e' : '#fff');

    const game = getGameInfo();

    document.querySelector('#btn-continue').style.display = game ? 'grid' : 'none';

    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();

    if (getPlayerName()) {
        name_input.value = getPlayerName();
    } else {
        name_input.focus();
    }
}
var aud=document.getElementById("audiobut");
var inv=document.getElementById("game-vol-up");
var up_vol=document.getElementById("up-vol");
var dn_vol=document.getElementById("down-vol");
var dev=document.getElementById("game-vol-down");

inv.addEventListener('click',()=>{
    let z=aud.volume;
    z+=0.1;
    let z1=z*100;
    let txt=z1.toString();
    if(z<=1)
    {
       // up_vol.innerHTML="Volume Up   "+txt+"%";   
        aud.volume=z;
    }
});
dev.addEventListener('click',()=>{
    let z=aud.volume;
    z-=0.1;
    
    if(z==0)
    {
        aud.pause();
    }
    if(z>0)
    {
        aud.volume=z;
        //dn_vol.innerHTML="Volume Down   "+txt+"%";
    }
  
});
const playMusic=()=>{
    
    aud.play();
    let z1=0.3*100;
    let txt=z1.toString();
    //up_vol.innerHTML="Volume Up    "+txt+"%";
   // dn_vol.innerHTML="Volume Down    "+txt+"%";
    aud.volume=0.3;
}
const stopMusic =()=>{
   aud.pause();
}
init();

//Backtraking to solve sudoku
let isSolve=false;
var hnt=document.getElementById("btn-play");
var tg=document.getElementById("game-hint");
let grid;
hnt.addEventListener('click',()=>{
    grid=newGr(9);
    backtrack(grid,0,0)
    const myobj={
        obj:grid
    }
   // console.table(myobj.obj)
    window.localStorage.setItem("grd",JSON.stringify(myobj));
    let orgGridValue=window.localStorage.getItem("grd");
    let val=(JSON.parse(orgGridValue));
    let grd=val.obj;
   // console.log(grd)
    
})
function fillHintval()
{
    if(xcor!=-1 && ycor!=-1)
    tg.innerHTML=grid[xcor][ycor];
}
tg.addEventListener('click',()=>{
 
    var d=tg.innerHTML;
    if(d!="Hint")
    tg.innerHTML="Hint";
    else
    fillHintval();
    
})
var sol=document.getElementById("game-solve");
sol.addEventListener('click',()=> {
     let grid=newGr(9);
     orgGrid=grid;
     var x=cells[0].innerHTML;
   // console.log(grid);
  
   if(!isSolve)
   {

    const myobj={
        obj:grid
    }
   // console.table(myobj.obj)
    window.localStorage.setItem("grd",JSON.stringify(myobj));
     backtrack(grid,0,0);
    // console.table(grid)
    
     if(isValidGrid(grid))
    {
        filledGrid(grid);
        pause=true;
        isSolve=true;
        sol.innerHTML="Un Do";
    }
    
      //console.log(gg)
   }
   else{

       isSolve=false;
       let orgGridValue=window.localStorage.getItem("grd");
       let val=(JSON.parse(orgGridValue));
        filledGrid(val.obj);
      // console.table(val.obj)
      pause=false;
       sol.innerHTML="Solve";
   }
    
 });
 function filledGrid(grid)
 {
     let x=0;
     for(let i=0;i<9;i++)
     {
         for(let j=0;j<9;j++)
         {
             let val=grid[i][j];
            // console.log(val)
             cells[x++].innerHTML=val;
          //   cells[(i+1)*(j+1)].innerHTML=val;
         }
     }
 }
function backtrack(grid,i,j){
   if(i==9)
   return true;
   if(j==9)
   return backtrack(grid,i+1,0);
   if(grid[i][j]!=='')
   return backtrack(grid,i,j+1);
   else{
       for(var k='1';k<='9';k++)
       {
           if(isValid(grid,i,j,k))
           {
               grid[i][j]=k;
               if(backtrack(grid,i,j+1))
               return true;
               grid[i][j]='';
           }
       }
   }
   return false;

 }
 function isValidGrid(grid)
 {
     for(let i=0;i<9;i++)
     {
        const s=new Set();
         for(let j=0;j<9;j++)
         {
             
             s.add(grid[i][j]);

         }
         if(s.size!=9)
         {           
             return false;
         }
     }
     for(let i=0;i<9;i++)
     {
        const s=new Set();
         for(let j=0;j<9;j++)
         {
           
             s.add(grid[j][i]);

         }
         if(s.size!=9)
         return false;
     }
     for(let i=0;i<3;i++)
     {
        
         for(let j=0;j<3;j++)
         {
           
            const s=new Set();
            for(let k=(i*3);k<(i*3)+3;k++)
            {
              for(let z=(j*3);z<(j*3)+3;z++)
              {
                  s.add(grid[k][z]);
              }
            }
            if(s.size!=9)
            return false;
         }

     }
     return true;
 }
 function isValid(board,x,y,k){
    for(let z=0;z<board[0].length;z++)
    {
        if(board[z][y]==k)
            return false;
    }
    for(let i=0;i<board.length;i++)
    {
        if(board[x][i]==k)
            return false;
    }
    let corx=x-x%3;
    let cory=y-y%3;
    for(let i=0;i<3;i++)
     {
         for(let j=0;j<3;j++)
         {
             if(board[corx+i][cory+j]==k)
                 return false;
         }
     }
     return true;
      
 }
 const newGr = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);  
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        //console.log(CONSTANT.UNASSIGNED);
        if(cells[i].innerHTML.trim()>0)
        arr[Math.floor(i/size)][i%size] = cells[i].innerHTML;
        else
        {
           arr[Math.floor(i/size)][i%size] ='';
          // console.log(cells[i].innerHTML);
        }
    }

    return arr;
}