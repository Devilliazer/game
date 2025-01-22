// Отримуємо холст і контекст
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Встановлюємо розмір холста
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Завантажуємо спрайт-лист
const sprites = new Image();
sprites.src = "game_assets/sprites.webp";
sprites.onerror = ()=>{
    console.error("\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u0441\u043F\u0440\u0430\u0439\u0442-\u043B\u0438\u0441\u0442.");
};
sprites.onload = ()=>{
    console.log("\u0421\u043F\u0440\u0430\u0439\u0442-\u043B\u0438\u0441\u0442 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043E.");
    drawScene();
    gameLoop();
};
// Позиція гравця
const playerPosition = {
    x: 0,
    y: 0
};
// Поточне зміщення карти
let offsetX = 0;
let offsetY = 0;
// Розмір тайла
const TILE_SIZE = 64;
const TILES_X = Math.ceil(canvas.width / TILE_SIZE);
const TILES_Y = Math.ceil(canvas.height / TILE_SIZE);
// Двовимірний масив для збереження тайлів
const tileMap = {};
function getTileKey(x, y) {
    return `${x},${y}`;
}
function generateTileType() {
    return Math.floor(Math.random() * 2); // 0 - трава, 1 - дерево
}
function getOrGenerateTile(x, y) {
    const key = getTileKey(x, y);
    if (!(key in tileMap)) tileMap[key] = generateTileType();
    return tileMap[key];
}
// Генерація тайлів
function drawTile(x, y, tileType) {
    if (tileType === 0) // Малюємо траву
    ctx.drawImage(sprites, 0, 0, 64, 64, x * TILE_SIZE - offsetX, y * TILE_SIZE - offsetY, TILE_SIZE, TILE_SIZE);
    else // Малюємо дерево
    ctx.drawImage(sprites, 0, 0, 64, 64, x * TILE_SIZE - offsetX, y * TILE_SIZE - offsetY, TILE_SIZE, TILE_SIZE);
}
// Малюємо сцену
function drawScene() {
    // Очищаємо холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Малюємо тайли
    for(let y = Math.floor(offsetY / TILE_SIZE); y <= Math.floor(offsetY / TILE_SIZE) + TILES_Y; y++)for(let x = Math.floor(offsetX / TILE_SIZE); x <= Math.floor(offsetX / TILE_SIZE) + TILES_X; x++){
        const tileType = getOrGenerateTile(x, y);
        drawTile(x, y, tileType);
    }
    function drawGrid() {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        for(let x = 0; x < canvas.width; x += TILE_SIZE){
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for(let y = 0; y < canvas.height; y += TILE_SIZE){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    // Малюємо персонажа в центрі екрану
    ctx.drawImage(sprites, 0, 0, 64, 64, canvas.width / 2 - TILE_SIZE / 2, canvas.height / 2 - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
}
// Логіка руху
const movement = {
    w: false,
    s: false,
    a: false,
    d: false
};
function updatePlayerPosition() {
    const speed = 10;
    if (movement["w"] === true) playerPosition.y -= speed;
    if (movement["s"] === true) playerPosition.y += speed;
    if (movement["a"] === true) playerPosition.x -= speed;
    if (movement["d"] === true) playerPosition.x += speed;
    //console.log("Позиція гравця:", playerPosition);
    // Оновлюємо зміщення карти
    offsetX = playerPosition.x - canvas.width / 2 + TILE_SIZE / 2;
    offsetY = playerPosition.y - canvas.height / 2 + TILE_SIZE / 2;
    //console.log("Зміщення карти:", { offsetX, offsetY });
    drawScene();
}
// Додаємо слухачі для клавіатури
window.addEventListener("keyup", (e)=>{
    console.log("\u041F\u043E\u0434\u0456\u044F keyup \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043B\u0430", e.key);
    const key = e.key.toLowerCase();
    if (key in movement) {
        movement[key] = false;
        console.log(`\u{41A}\u{43B}\u{430}\u{432}\u{456}\u{448}\u{430} \u{432}\u{456}\u{434}\u{43F}\u{443}\u{449}\u{435}\u{43D}\u{430}: ${key}`);
    }
});
window.addEventListener("keydown", (e)=>{
    console.log("\u041F\u043E\u0434\u0456\u044F keydown \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043B\u0430", e.key);
    const key = e.key.toLowerCase();
    if (key in movement) {
        movement[key] = true;
        console.log(`\u{41A}\u{43B}\u{430}\u{432}\u{456}\u{448}\u{430} \u{43D}\u{430}\u{442}\u{438}\u{441}\u{43D}\u{443}\u{442}\u{430}: ${key}`);
    }
});
window.addEventListener("keydown", (e)=>{
    if ([
        "w",
        "a",
        "s",
        "d"
    ].includes(e.key.toLowerCase())) {
        e.preventDefault();
        movement[e.key.toLowerCase()] = true;
    }
});
// Слухачі для джойстика
const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
if (!joystick || !stick) console.error("\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0438 \u0434\u0436\u043E\u0439\u0441\u0442\u0438\u043A\u0430 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E!");
else {
    let isDragging = false;
    let centerX = joystick.offsetWidth / 2;
    let centerY = joystick.offsetHeight / 2;
    stick.addEventListener("mousedown", (e)=>{
        isDragging = true;
    });
    window.addEventListener("mousemove", (e)=>{
        if (isDragging) {
            const rect = joystick.getBoundingClientRect();
            const x = e.clientX - rect.left - centerX;
            const y = e.clientY - rect.top - centerY;
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = joystick.offsetWidth / 2 - stick.offsetWidth / 2;
            if (distance > maxDistance) {
                const angle = Math.atan2(y, x);
                stick.style.left = `${Math.cos(angle) * maxDistance + centerX - stick.offsetWidth / 2}px`;
                stick.style.top = `${Math.sin(angle) * maxDistance + centerY - stick.offsetHeight / 2}px`;
            } else {
                stick.style.left = `${x + centerX - stick.offsetWidth / 2}px`;
                stick.style.top = `${y + centerY - stick.offsetHeight / 2}px`;
            }
            // Оновлення руху
            movement["w"] = y < -maxDistance * 0.5;
            movement["s"] = y > maxDistance * 0.5;
            movement["a"] = x < -maxDistance * 0.5;
            movement["d"] = x > maxDistance * 0.5;
        }
    });
    window.addEventListener("mouseup", ()=>{
        isDragging = false;
        stick.style.left = `${centerX - stick.offsetWidth / 2}px`;
        stick.style.top = `${centerY - stick.offsetHeight / 2}px`;
        movement["w"] = false;
        movement["s"] = false;
        movement["a"] = false;
        movement["d"] = false;
    });
}
// Постійне оновлення сцени та контроль фпс
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    if (deltaTime > 1000 / 144) {
        updatePlayerPosition();
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}
// Розміри екрану 
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawScene();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
window.addEventListener("orientationchange", resizeCanvas);

//# sourceMappingURL=game_index.57c59ef0.js.map
