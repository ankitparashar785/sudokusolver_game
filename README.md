This sudoku solver puzzle has diffrent level of difficulty :

    1 EASY
    2 MEDIUM
    3 HARD
    4 VERY_HARD
    5 INSANE
    

Algorithm:


This solver uses a backtracking tree-based recursive search algorithm:

  1 : If a given board state is invalid return false (base case)
  
  2 : If a given board state has no blank spaces left return the board (base case)
  
  3: Find the next empty cell on the board and its possible choices
  
  4: Iterate through each possible choice:
  
  5: Replace the empty cell with the current possible choice
  
  6: Call the current function with the new board state; that is, create a new stack frame and go back to 1.
  
  7: If a truthy base case is found down some recursive branch, return that board state to the parent caller
  
  8: If iteration completes without finding a valid board, return false to the parent caller (reaching this step indicates a dead end and returning false results in the     continuation of the iteration in the previous stack frame)
  
    
