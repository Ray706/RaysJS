class BlobMaze {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  }

  generate() {
    this.divide(0, 0, this.size, this.size, 3);
  }

  divide(x, y, width, height, depth) {
    if (depth === 0) return;
    const wx = Math.floor(x + width / 2);
    const wy = Math.floor(y + height / 2);
    const px = Math.floor(wx + (Math.random() * 2 - 1));
    const py = Math.floor(wy + (Math.random() * 2 - 1));

    for (let i = 0; i < width; i++) this.grid[wy][x + i] = 1;
    for (let i = 0; i < height; i++) this.grid[y + i][wx] = 1;

    this.grid[py][wx] = 0;
    this.grid[wy][px] = 0;

    this.divide(x, y, wx - x, wy - y, depth - 1);
    this.divide(wx + 1, y, x + width - wx - 1, wy - y, depth - 1);
    this.divide(x, wy + 1, wx - x, y + height - wy - 1, depth - 1);
    this.divide(wx + 1, wy + 1, x + width - wx - 1, y + height - wy - 1, depth - 1);
  }
}

const maze = new BlobMaze(10);
maze.generate();
console.log(maze.grid);
