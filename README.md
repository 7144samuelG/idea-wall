# Sudoku Game Application

## Overview
A 2D game application that allows users to play Sudoku puzzles with puzzle generation, solving capabilities, and custom puzzle input functionality.

## Core Features

### Puzzle Generation
- Generate valid Sudoku puzzles with varying difficulty levels (easy, medium, hard)
- Each generated puzzle has a unique solution
- Reliable puzzle generation that never fails or returns empty/unsolvable boards
- Proper randomness in clue distribution to avoid repeated positions
- Clear error handling with informative error messages for any generation failures

### Puzzle Solving
- Solve any valid Sudoku board provided by the user
- Return the complete solution for the given puzzle

### Interactive Gameplay
- Display a 9x9 Sudoku grid interface
- Allow users to input numbers (1-9) into empty cells
- Clear visual distinction between pre-filled numbers and user inputs
- Basic input validation to ensure only valid numbers are entered
- Victory celebration when puzzle is completed successfully

### Custom Puzzle Input
- Allow users to input their own Sudoku puzzles
- Validate that the input represents a valid Sudoku board configuration
- Support solving user-provided puzzles

## Backend Requirements
The backend stores and manages:
- Robust puzzle generation algorithms for different difficulty levels with improved randomness
- Sudoku solving algorithms
- Validation logic for Sudoku board configurations
- Error handling mechanisms for puzzle generation failures

Backend operations:
- Generate new puzzle with specified difficulty (accepts difficulty as string: "easy", "medium", "hard")
- Solve provided Sudoku board
- Validate Sudoku board structure and rules
- Handle and report puzzle generation errors with clear messages
- Map string-based difficulty values to appropriate internal behavior

## Frontend Requirements
The frontend manages:
- Current game state (user inputs, selected cells)
- Display of the Sudoku grid
- User interface for puzzle generation and solving requests
- All active gameplay state remains in the frontend
- Display error messages from backend when puzzle generation fails
- Victory detection and celebration display when puzzle is completed successfully
- "You Win!" message or celebratory animation when the backend's validateBoard function returns true

## Technical Notes
- Game state is maintained entirely in the frontend
- Backend provides puzzle generation and solving services via API calls
- Backend accepts difficulty as string values ("easy", "medium", "hard") in all public functions
- Input validation ensures proper Sudoku rules are followed
- Puzzle generation includes robust error handling and retry mechanisms
- Victory state is triggered by successful board validation from the backend
- Application language: English
