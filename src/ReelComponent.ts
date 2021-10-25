import { GameSymbol } from "./symbol";
import * as PIXI from 'pixi.js';
import { Game } from "./Game";
import { toJS } from "mobx";
import { ReelSettings } from "./ReelSettings";
import { StateMachine } from "./States";
import { gsap } from "gsap";
import { AudioManager } from "./AudioManager";
/**
 * ReelComponent
 * initialises the reels and handles the spinning in/out
 */
export class ReelComponent {

    public static readonly REEL_ROWS: number = 3;
    public static readonly REEL_COLUMNS: number = 5;
    private _reelSetContainer: PIXI.Container;
    public reels: PIXI.Container[] = [];
    public isSpinning: boolean = false;
    private _symbolSet: GameSymbol[] = [];
    private _stateMachine: StateMachine;
    private _currentSymbols: GameSymbol[] = [];
    private _audioManager: AudioManager;
    constructor(symbolSet: GameSymbol[], stateMachine: StateMachine, audioManager: AudioManager) {
        this._reelSetContainer = new PIXI.Container();
        this._reelSetContainer.x = 200;
        this._reelSetContainer.y = 150;
        this._symbolSet = symbolSet;
        this._stateMachine = stateMachine;
        this._audioManager = audioManager;
    }


    public initReels(): void {
        this.createStrips();
        this.createMask();
    }

    public getReel(): PIXI.Container {
        return this._reelSetContainer;
    }

    //creates the reel mask
    private createMask(): void {
        let symbol = this._symbolSet[0];
        let rectangle = new PIXI.Graphics().beginFill(0xFF3300).drawRect(0, 0, symbol.width * 5, symbol.height * 3).endFill();
        this._reelSetContainer.addChild(rectangle);
        this._reelSetContainer.mask = rectangle;
    }

    //create initial reel picture
    private createStrips(): void {
        for (let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++) {
            let reel = new PIXI.Container();
            reel.name = `reel_${i}`;
            this.reels.push(reel);
            reel.x = i * this._symbolSet[0].width;
            for (let j: number = 2; j > -1; j--) {
                let randInt = this.randomIntFromInterval(0, 7);
                let symbol = new GameSymbol(this._symbolSet[randInt].getTexture(), this._symbolSet[randInt].symbolId);
                reel.addChild(symbol);
                symbol.y += j * symbol.height;
                symbol.visible = true;
            }
            this._reelSetContainer.addChild(reel);
        }
    }

    public recreateStrips(): void {
        this._currentSymbols = [];
        for (let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++) {
            let reel = this._reelSetContainer.getChildAt(i) as PIXI.Container;
            for (let j: number = 0; j < ReelComponent.REEL_ROWS; j++) {
                let randInt = this.randomIntFromInterval(0, 7);
                let symbol = new GameSymbol(this._symbolSet[randInt].getTexture(), this._symbolSet[randInt].symbolId);
                reel.addChild(symbol);
                this._currentSymbols.push(symbol);
                symbol.visible = false;
                symbol.y = -symbol.height;
            }
        }
    }
    //drops the new reels in from above.
    public dropReelsIn(): void {

        for (let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++) {
            gsap.delayedCall(ReelSettings.REEL_DELAY * i, () => {
                let reel = this._reelSetContainer.getChildByName(`reel_${i}`) as PIXI.Container;
                let delay: number = 0;
                for (let j: number = 0; j < 3; j++) {
                    let symbol = reel.getChildAt(j) as GameSymbol
                    let dropDist = symbol.height * 2;
                    if (symbol.y < 0) {
                        dropDist = symbol.y * -1 + symbol.height * 2;
                    }
                    dropDist = symbol.height * 2 - symbol.y;
                    this.dropSymbol(dropDist, dropDist - j * symbol.height, delay, symbol, false, i);
                    delay += ReelSettings.SYMBOL_DELAY;
                }

            })
        }
    }
    //drops the reels below the reel picture
    public dropReelsOut(): void {
        this.isSpinning = true;
        for (let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++) {
            gsap.delayedCall(ReelSettings.REEL_DELAY * i, () => {
                let reel = this._reelSetContainer.getChildByName(`reel_${i}`) as PIXI.Container;
                let delay: number = 0;
                for (let j: number = 0; j < ReelComponent.REEL_ROWS; j++) {
                    let dropDist: number = 0;
                    let symbol = reel.getChildAt(j) as GameSymbol
                    symbol.visible = true;
                    dropDist = 1200 - symbol.y;
                    this.dropSymbol(1200, dropDist, delay, symbol, true, i);
                    delay += ReelSettings.SYMBOL_DELAY;
                }
            })
        }
    }

    public dropSymbol(maxDist: number, dropDist: number, delay: number, symbol: GameSymbol, areRemoved: boolean = false, column: number): void {
        let dropPercent = dropDist / maxDist;
        const speed = dropPercent * ReelSettings.REEL_SPEED;
        symbol.visible = true;
        if (speed === 0) {
            console.error("speed is: " + speed, "cannot move with 0 speed.")
            return;
        }
        if (delay) {
            gsap.delayedCall(delay, () => {
                gsap.to(symbol, {
                    duration: speed, y: symbol.y + dropDist, onComplete: () => {
                        if (areRemoved) {
                            if (symbol.parent.children.length === 1 && column === 4) {
                                //must be the last symbol on the reel and the last reel. Spin in new reels.
                                symbol.parent.removeChild(symbol);
                                symbol.visible = false;
                                symbol.destroy();
                                this.recreateStrips();
                                this.dropReelsIn();
                                return;
                            }
                            symbol.parent.removeChild(symbol);
                            symbol.visible = false;
                            symbol.destroy();
                        }
                        if (!areRemoved) {
                            //if we're not dropping and we are at the last symbol then the spin is complete. Move onto winPresentation or whatever next.
                            if (symbol === symbol.parent.getChildAt(2) && column === 4) {
                                this.isSpinning = false;
                                this._stateMachine.setState(StateMachine.WIN_PRESENTATION);
                                //add a state change here? If we get round to doing a stateMachine e.g REELS_IDLE
                            }
                        }
                    }
                })
            })
        }
        else {
            gsap.to(symbol, {
                duration: speed, y: symbol.y + dropDist, onComplete: () => {
                    if (areRemoved) {
                        symbol.parent.removeChild(symbol);
                        symbol.visible = false;
                        symbol.destroy();
                    }
                    else {
                        //first symbol landed, play reel sound
                        if (symbol === symbol.parent.getChildAt(0)) {
                            this._audioManager.playSound(`onReel${column + 1}Hit`);
                        }
                    }
                }
            })
        }
    }

    public getReelSymbols(reel: number): PIXI.DisplayObject[] {
        return this.reels[reel].children;
    }


    public getAllSymbols()
    {
        return this._currentSymbols;
    }

    public getSpecificReelSymbols(reel: number, name: string) {
        let arr: GameSymbol[] = [];
        for(let i: number = 0; i < this.reels[reel].children.length; i++)
        {
            let symbol = this.reels[reel].getChildAt(i) as GameSymbol;
            if(symbol instanceof GameSymbol && symbol.symbolId === name)
            {
                arr.push(symbol);
            }
        }
        return arr;
    }

    public reelHasSymbol(reel: number, symbolId: string) {
        let bool: boolean = false;
        if (!this.reels[reel].children) {
            return false;
        }
        this.reels[reel].children.forEach(symbol => {
            if (symbol instanceof GameSymbol) {
                if (symbol.symbolId === symbolId) {
                    bool = true;
                }
            }
        });
        return bool;
    }

    public getIndependentReel(reel: number): PIXI.DisplayObject {
        return this.reels[reel];
    }

    private randomIntFromInterval(min: number, max: number): number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}