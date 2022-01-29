var size;
var arr = new Array(size);
var solve_button;
var reset_button;

window.onload = ()=> {
    
    var create_button = document.getElementById('create_grid');
    create_button.onclick = () => {
       // g.play();
        size = document.getElementById('grid_size').value;
        //console.log(size);
        CreateGrid(size);
    }
}
function CreateGrid(size) {
    
    for(let i = 0; i < size; i++) {
        var row = new Array(size);
        for(let j = 0; j < size; j++) {
            var temp = document.createElement('input');

            temp.style.textAlign = "center"
            temp.style.color = "black";
            temp.style.borderRadius = "5px";
            temp.style.padding = "6px";
            temp.style.margin = "2px";
            temp.style.height = "15px";
            temp.style.width = "15px";
            temp.style.backgroundColor ="#00FFFF";
            if(j % Math.sqrt(size) == Math.sqrt(size) - 1) {
                temp.style.borderRight = "4px solid red";
            }

            if(i % Math.sqrt(size) == Math.sqrt(size) - 1) {
                temp.style.borderBottom = "4px solid red";
            }

            temp.value = 0;
            temp.size = 2;
            temp.min = 0;
            temp.max = size;
            row[j] = temp;
        }

        arr[i] = row;
    }

    document.getElementById("my_div").innerHTML = "";

    block = document.getElementById("my_div");

    block.appendChild(document.createElement('br'));


    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            block.appendChild(arr[i][j]);
        }
        block.appendChild(document.createElement('br'));
    }

    block.appendChild(document.createElement('br'));
    solve_button = document.createElement('button');
    reset_button = document.createElement('button');

    solve_button.innerHTML = 'SOLVE';
    reset_button.innerHTML = 'RESET GRID';
    reset_button.classList.add("hoverclass");
    reset_button.classList.add("hoverclass");
    solve_button.classList.add("hoverclassk");
    block.appendChild(solve_button)
    block.appendChild(reset_button);
    
    reset_button.onclick = () => {
        
        resetGrid(arr);
    }

    solve_button.onclick = () => {
        solveSudoko(arr); 
    }
    
    solve_button.style.padding = "5px";
    solve_button.style.backgroundColor = "lightgreen";
    solve_button.style.margin = "3px";
    solve_button.style.borderRadius = "7px";
    reset_button.style.padding = "5px";
    reset_button.style.margin = "3px";
    reset_button.style.borderRadius = "7px";
    
}

function getHtmlElements(cell) {
    return arr[cell[0]][cell[1]];
}

function resetGrid(arr) {
    console.log(arr);
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length; j++) {
            getHtmlElements([i, j]).value = 0;
            getHtmlElements([i,j]).style.backgroundColor="#00FFFF";
        }
    }
}

function solveSudoko(arr) {
    

    var emptyCells = findEmptyCells(arr);
    // console.log(emptyCells);

    var isValidInput = checkIsValidInput(arr);

    if(isValidInput == false) {
        alert('Invalid Suduko Input');
        resetGrid(arr);
    }

    else {

        for(let i = 0; i < emptyCells.length; i++) {
            var temp = fillEmptyCell(emptyCells[i]);
            if(temp == false) {
                i = i - 2;
                if(i == -2) {
                    alert('Invalid Input');
                    break;
                }
            }
        }

    }

}

function checkIsValidInput(arr) {

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            var currVal = arr[i][j].value;
            console.log(currVal);
            if(currVal != 0) {
                if(isValidRow([i, j], currVal) == false || isValidCol([i, j], currVal) == false || isValidGrid([i, j], currVal) == false) {
                    return false;
                }
            }
        }
    }
    return true;
}

function findEmptyCells(arr) {
    
    cells = [];
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length; j++) {
            //console.log(arr[i][j].value);
            if(arr[i][j].value == 0) {
                cells.push([i, j]);
            }
        }
    }

    return cells;
}
const colours = ["lime", "gold", "lightblue","deeppink","gray","magenta","Aquamarine","SpringGreen",
"hotpink","crimson","orange"];
function fillEmptyCell(cell) {
    var currVal = parseInt(getHtmlElements(cell).value);
    for(let i = currVal + 1; i <= size; i++) {
        if(isValidRow(cell, i) && isValidCol(cell, i) && isValidGrid(cell, i)) {
            getHtmlElements(cell).value = i;
            
            if(i<colours.length)
            {
                getHtmlElements(cell).style.backgroundColor = colours[i];
            }
            
            return true;
        }
    }
    getHtmlElements(cell).value = 0;
    return false;
}

function isValidRow(cell, value) {
    var rowNum = cell[0];
    var colNum = cell[1];

    for(let i = 0; i < size; i++) {
        if(getHtmlElements([rowNum, i]).value == value && i!= colNum) {
            return false;
        }
    }
    return true;
}

function isValidCol(cell, value) {
    var rowNum = cell[0];
    var colNum = cell[1];

    for(let i = 0; i < size; i++) {
        if(getHtmlElements([i, colNum]).value == value && i!= rowNum) {
            return false;
        }
    }
    return true;
}

function isValidGrid(cell, value) {

    var rowNum = cell[0];
    var colNum = cell[1];

    var root_n = Math.sqrt(size);

    var sub_x = root_n * Math.floor((rowNum / root_n));
    var sub_y = root_n * Math.floor((colNum / root_n));

    for(let i = sub_x; i < sub_x + root_n; i++) {
        for(let j = sub_y; j < sub_y + root_n; j++) {
            if(i != rowNum && j != colNum) {
                if(getHtmlElements([i, j]).value == value) {
                    return false;
                }
            }
        }
    }

    return true;

}
