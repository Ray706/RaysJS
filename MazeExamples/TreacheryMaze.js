class TreacheryMaze {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  }

  generate() {
    this.carvePath(0, 0);
    this.addTraps();
  }

  carvePath(x, y) {
    this.grid[y][x] = 1;
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2, ny = y + dy * 2;
      if (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size && this.grid[ny][nx] === 0) {
        this.grid[y + dy][x + dx] = 1;
        this.grid[ny][nx] = 1;
        this.carvePath(nx, ny);
      }
    }
  }

  addTraps() {
    for (let y = 1; y < this.size - 1; y++) {
      for (let x = 1; x < this.size - 1; x++) {
        if (this.grid[y][x] === 1 && Math.random() < 0.1) {
          this.grid[y][x] = 0;
        }
      }
    }
  }
}

const maze = new TreacheryMaze(10);
maze.generate();
console.log(maze.grid);
