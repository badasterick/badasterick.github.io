(() => {
  const TILE_SIZE = 24;
  const VIEW_COLS = 20;
  const VIEW_ROWS = 15;
  const CANVAS_W = VIEW_COLS * TILE_SIZE;
  const CANVAS_H = VIEW_ROWS * TILE_SIZE;

  const T = { GRASS:0, WALL:1, CAVE:2, FLOOR:3 };

  const overworld = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1],
    // cave entrance at [9,4] and [10,4]
    [1,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  const cave = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  function drawTile(ctx, t, x, y) {
    if (t === T.GRASS) ctx.fillStyle = "#7cfc00";
    else if (t === T.WALL) ctx.fillStyle = "#3a2d13";
    else if (t === T.CAVE) ctx.fillStyle = "#2b1b0f";
    else if (t === T.FLOOR) ctx.fillStyle = "#6b4e3d";
    else ctx.fillStyle = "#000";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    if (t === T.CAVE) {
      ctx.fillStyle = "#000";
      ctx.fillRect(x + 4, y + 6, TILE_SIZE - 8, TILE_SIZE - 8);
    }
  }

  function drawOldMan(ctx, px, py) {
    ctx.fillStyle = "#c86"; // robe
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#f2d7b6"; // face
    ctx.fillRect(px + 6, py + 2, 12, 8);
    ctx.fillStyle = "#000";
    ctx.fillRect(px + 9, py + 5, 2, 2);
    ctx.fillRect(px + 13, py + 5, 2, 2);
  }

  function isBlocked(map, x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    const t = (map[row] && map[row][col] !== undefined) ? map[row][col] : 1;
    return t === T.WALL;
  }

  function isOnCaveMouth(map, x, y) {
    const centerX = x + TILE_SIZE / 2;
    const centerY = y + TILE_SIZE / 2;
    const col = Math.floor(centerX / TILE_SIZE);
    const row = Math.floor(centerY / TILE_SIZE);
    return map[row] && map[row][col] === T.CAVE;
  }

  // modal helpers
  const modal = {
    el: null, frame: null, link: null, closeBtn: null,
    open(url) {
      this.frame.src = url;
      this.link.href = url;
      this.el.classList.remove("hidden");
      this.el.setAttribute("aria-hidden", "false");
    },
    close() {
      this.el.classList.add("hidden");
      this.el.setAttribute("aria-hidden", "true");
      this.frame.src = "about:blank";
    }
  };

  function main() {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    // ensure integer internal canvas size
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    // modal wiring
    modal.el = document.getElementById("resumeModal");
    modal.frame = document.getElementById("resumeFrame");
    modal.link = document.getElementById("openNewTab");
    modal.closeBtn = document.getElementById("closeBtn");
    modal.closeBtn.addEventListener("click", () => modal.close());
    modal.el.addEventListener("click", (e) => {
      if (e.target === modal.el) modal.close();
    });

    const RESUME_URL = (window.RESUME_URL || "").toString();

    let scene = "overworld";
    let showDialog = false;
    const player = { x: 5 * TILE_SIZE, y: 10 * TILE_SIZE };
    const oldManPos = { x: 9 * TILE_SIZE, y: 6 * TILE_SIZE };
    const speed = 2;
    const keys = Object.create(null);

    window.addEventListener("keydown", (e) => {
      keys[e.key.toLowerCase()] = true;
      if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    function resetForScene() {
      if (scene === "overworld") {
        player.x = 5 * TILE_SIZE; player.y = 10 * TILE_SIZE;
      } else {
        player.x = 9 * TILE_SIZE; player.y = 11 * TILE_SIZE;
      }
      showDialog = false;
    }

    function draw() {
      const map = scene === "overworld" ? overworld : cave;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      for (let r = 0; r < VIEW_ROWS; r++) {
        for (let c = 0; c < VIEW_COLS; c++) {
          const raw = map[r][c];
          const paint = (scene === "overworld")
            ? (raw === T.CAVE ? T.CAVE : raw)
            : (raw === T.WALL ? T.WALL : T.FLOOR);
          drawTile(ctx, paint, c * TILE_SIZE, r * TILE_SIZE);
        }
      }
      if (scene === "overworld") {
        ctx.strokeStyle = "#000"; ctx.lineWidth = 2;
        ctx.strokeRect(10 * TILE_SIZE, 4 * TILE_SIZE, 1 * TILE_SIZE, 1 * TILE_SIZE);
      }
      if (scene === "cave") drawOldMan(ctx, oldManPos.x, oldManPos.y);
      // player
      ctx.fillStyle = "#1faa00";
      ctx.fillRect(player.x, player.y, TILE_SIZE, TILE_SIZE);

      // dialog UI
      if (showDialog) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(10, CANVAS_H - 90, CANVAS_W - 20, 80);
        ctx.strokeStyle = "#fff"; ctx.strokeRect(10, CANVAS_H - 90, CANVAS_W - 20, 80);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.fillText("“It’s dangerous to go alone! Take this.”", 24, CANVAS_H - 60);
        ctx.fillText("Press [E] to open Anthony’s resume", 24, CANVAS_H - 40);
      }
    }

    function update() {
      const map = scene === "overworld" ? overworld : cave;
      let dx = 0, dy = 0;
      if (keys["arrowup"] || keys["w"]) dy -= speed;
      if (keys["arrowdown"] || keys["s"]) dy += speed;
      if (keys["arrowleft"] || keys["a"]) dx -= speed;
      if (keys["arrowright"] || keys["d"]) dx += speed;

      // basic collision in steps
      const steps = 2;
      for (let i = 0; i < steps; i++) {
        const tryX = player.x + dx / steps;
        const tryY = player.y + dy / steps;
        if (!isBlocked(map, tryX, player.y)) player.x = tryX;
        if (!isBlocked(map, player.x, tryY)) player.y = tryY;
      }

      // enter cave
      if (scene === "overworld" && isOnCaveMouth(overworld, player.x, player.y)) {
        scene = "cave";
        resetForScene();
      }

      // show dialog near old man
      if (scene === "cave") {
        const close = Math.abs(player.x - oldManPos.x) < TILE_SIZE && Math.abs(player.y - oldManPos.y) < TILE_SIZE;
        showDialog = close;
      }

      // open resume
      if (showDialog && (keys["e"] || keys["enter"])) {
        modal.open(RESUME_URL || "about:blank");
      }
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    resetForScene();
    loop();
    // focus for keyboard
    canvas.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();