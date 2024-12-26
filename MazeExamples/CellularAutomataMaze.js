class CellularAutomataMaze {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random() < 0.45 ? 1 : 0));
  }

  generate() {
    for (let i = 0; i < 5; i++) {
      this.step();
    }
  }

  step() {
    const newGrid = this.grid.map(arr => arr.slice());

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const aliveNeighbors = this.countAliveNeighbors(x, y);

        if (this.grid[y][x] === 1) {
          newGrid[y][x] = aliveNeighbors < 4 ? 0 : 1;
        } else {
          newGrid[y][x] = aliveNeighbors > 4 ? 1 : 0;
        }
      }
    }

    this.grid = newGrid;
  }

  countAliveNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
          count += this.grid[ny][nx];
        }
      }
    }
    return count;
  }
}

const maze = new CellularAutomataMaze(10);
maze.generate();
console.log(maze.grid);
