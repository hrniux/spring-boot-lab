const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = readFileSync(join(__dirname, '../src/main/resources/static/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function game() {
    const timers = new Map();
    let timerId = 0;
    const drawing = new Proxy({}, { get: () => () => {} });
    const elements = Object.fromEntries(['game-canvas', 'score', 'start-btn', 'pause-btn'].map(id => [id, {
        width: 400, height: 400, textContent: '',
        getContext: () => drawing, addEventListener: () => {}
    }]));
    const context = vm.createContext({
        document: { getElementById: id => elements[id], addEventListener: () => {} },
        setInterval: (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; },
        clearInterval: id => timers.delete(id)
    });
    const run = code => vm.runInContext(code, context, { timeout: 1000 });
    run(script);
    return { run, timers, elements };
}

test('Start begins movement from the initial rendered board', () => {
    const { run, timers } = game();
    run('startGame()');
    assert.equal(timers.size, 1);
    timers.values().next().value.callback();
    assert.equal(run('snake[0].x'), 6);
});

test('Start resumes a paused game without adding another timer', () => {
    const { run, timers } = game();
    run('gameOver(); startGame()');
    for (let i = 0; i < 3; i++) {
        run('togglePause(); startGame()');
        assert.equal(timers.size, 1);
    }
    run('startGame(); gameOver()');
    assert.equal(timers.size, 0);
});

test('Pause and Continue stop and resume movement through the same timer', () => {
    const { run, timers } = game();
    run('gameOver(); startGame(); togglePause()');
    timers.values().next().value.callback();
    assert.equal(run('snake[0].x'), 5);
    run('togglePause()');
    timers.values().next().value.callback();
    assert.equal(run('snake[0].x'), 6);
    assert.equal(timers.size, 1);
});

test('a new game restores the initial movement speed', () => {
    const { run, timers } = game();
    run('gameSpeed = 50; gameOver(); startGame()');
    assert.equal(timers.values().next().value.delay, 150);
});

test('a non-growing move can enter the cell vacated by the tail', () => {
    const { run } = game();
    run('snake = [{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:2,y:1}]; nextDirection = "right"; food = {x:8,y:8}; update()');
    assert.equal(run('isGameOver'), false);
    assert.equal(run('snake[0].x'), 2);
    assert.equal(run('snake.length'), 4);
});

test('moving into the body still ends the game', () => {
    const { run } = game();
    run('snake = [{x:1,y:1},{x:2,y:1},{x:2,y:2},{x:1,y:2}]; nextDirection = "right"; food = {x:8,y:8}; update()');
    assert.equal(run('isGameOver'), true);
});

test('food uses the remaining free cell even with constant randomness', () => {
    const { run } = game();
    run('snake = Array.from({length:399}, (_,i) => ({x:i % 20, y:Math.floor(i / 20)})); Math.random = () => 0; generateFood()');
    assert.equal(run('food.x'), 19);
    assert.equal(run('food.y'), 19);
});

test('eating the final food finishes the game without blocking', () => {
    const { run, timers } = game();
    run('gameOver(); startGame(); snake = Array.from({length:399}, (_,i) => ({x:i % 20, y:Math.floor(i / 20)})).reverse(); food = {x:19,y:19}; nextDirection = "right"; update()');
    assert.equal(run('snake.length'), 400);
    assert.equal(run('score'), 10);
    assert.equal(run('isGameOver'), true);
    assert.equal(timers.size, 0);
    assert.equal(run('food'), null);
});
