import * as PIXI from 'pixi.js';
import { Game } from './Game';
const load = (app: PIXI.Application) => {
    return new Promise<void>((resolve) => {
        app.loader.add([
        'assets/symbols/symbol_1.png',
        'assets/symbols/symbol_2.png',
        'assets/symbols/symbol_3.png',
        'assets/symbols/symbol_4.png',
        'assets/symbols/symbol_5.png',
        'assets/symbols/symbol_6.png',
        'assets/symbols/symbol_7.png',
        'assets/symbols/symbol_8.png',
    ]).load(() => {
            resolve();
        });
    });
};

const main = async () => {
    // Actual app
    let app = new PIXI.Application();

    // Display application properly
    document.body.style.margin = '0';
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';

    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);

    let game = new Game(app.stage);

    app.ticker.add((delta)=>{
        update(game, delta)
    });

    document.body.appendChild(app.view);

};

function update(game: Game, delta: number): void {
    game.moveImage();
};

main();
