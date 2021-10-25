import { ReelComponent } from "./reelComponent";
import { StateMachine } from "./States";
import { GameSymbol } from "./symbol";
import { gsap } from "gsap";
import * as PIXI from 'pixi.js';
/**
 * WinPresentation
 * Parses each reel in the window and figures out how many of each symbol have landed. This is just a simple class that is likely full of bugs, designed to show part of the game flow.
 */
export class WinPresentation extends PIXI.Container {
    private static readonly SYMBOLS_TOTAL: number = 8;
    private symbolMap: Map<string, number> = new Map();

    private _reelComponent: ReelComponent;
    private _stateMachine: StateMachine;
    private _winLabel: PIXI.Text | undefined;
    private _winValue: PIXI.Text | undefined;
    constructor(reelComponent: ReelComponent, stateMachine: StateMachine) {
        super();
        this._reelComponent = reelComponent;
        this._stateMachine = stateMachine;
        for (let i: number = 0; i < WinPresentation.SYMBOLS_TOTAL; i++) {
            this.symbolMap.set(`symbol_${i + 1}`, 0);
        }
        this.createWinText("WIN!", "");
    }

    public publishWin(): void {
        let delay: number = 0.5;
        this.highlightWinningSymbols();
        //short delay before we enable spin again, add 1 second to delay if there is a win
        gsap.delayedCall(delay, () => {
            this.resetSymbolMap();
            this._stateMachine.setState(StateMachine.IDLE_STATE);
        })
    }

    protected highlightWinningSymbols() {
        let isWin: boolean = false;
        let symbols: GameSymbol[] = [];
        this.symbolMap.forEach((symbol, string) => {
            if (this._reelComponent.reelHasSymbol(0, string) && this._reelComponent.reelHasSymbol(1, string) && this._reelComponent.reelHasSymbol(2, string)) {
                //is a win.
                isWin = true;
                symbols.push(...this._reelComponent.getSpecificReelSymbols(0, string))
                symbols.push(...this._reelComponent.getSpecificReelSymbols(1, string))
                symbols.push(...this._reelComponent.getSpecificReelSymbols(2, string))
                if (this._reelComponent.reelHasSymbol(3, string)) {
                    symbols.push(...this._reelComponent.getSpecificReelSymbols(3, string));
                    if (this._reelComponent.reelHasSymbol(4, string)) {
                        symbols.push(...this._reelComponent.getSpecificReelSymbols(4, string));
                    }
                }
                this.alphaAllSymbols(0.3);
                symbols.forEach((symbol) => {
                    symbol.setMask(1);
                })
            }
        })
        if (this._winLabel && isWin) {
            this._winLabel.alpha = 0;
            this._winLabel.visible = true;
            gsap.to([this._winLabel], { duration: 0.5, alpha: 1 })
        }
    }

    public reset()
    {
        this.alphaAllSymbols(1);
        gsap.to([this._winLabel], {
            duration: 0.3, alpha: 0
        })
    }

    protected alphaAllSymbols(brightness: number)
    {
        let symbols = this._reelComponent.getAllSymbols();
        symbols.forEach((symbol)=>{
            symbol.setMask(brightness)
        })
    }

    protected resetSymbolMap(): void {
        this.symbolMap.clear();
        for (let i: number = 0; i < WinPresentation.SYMBOLS_TOTAL; i++) {
            this.symbolMap.set(`symbol_${i + 1}`, 0);
        }
    }

    protected createWinText(text: string, valueText: string) {
        this._winLabel = new PIXI.Text(text, this.labelStyle);
        this.addChild(this._winLabel);
        this._winLabel.width = 400;
        this._winLabel.height = 300;
        this._winLabel.x = 1450;
        this._winLabel.y = 100;

        this._winLabel.visible = true;
        this._winLabel.alpha = 0;

        this._winValue = new PIXI.Text(valueText, this.valueStyle);
        this.addChild(this._winValue);
        this._winValue.x = 1460;
        this._winValue.y = 380;

        this._winValue.visible = true;
        this._winValue.alpha = 0;
    }

    protected get labelStyle(): PIXI.TextStyle {
        return new PIXI.TextStyle({
            "align": "center",
            "dropShadow": true,
            "dropShadowAlpha": 0.8,
            "dropShadowAngle": 1.5,
            "dropShadowDistance": 6,
            "fill": ["white", "#fdf7d3", "#fdea35", "#ff9500"],
            "fillGradientStops": [0.2, 0.4, 0.6, 0.8],
            "fontSize": 300,
            "stroke": "#0018d1",
            "strokeThickness": 8,
            "trim": false,
            "whiteSpace": "pre",
            "wordWrap": false
        })
    }

    protected get valueStyle(): PIXI.TextStyle {
        return new PIXI.TextStyle({
            "align": "center",
            "dropShadow": false,
            "dropShadowAlpha": 0.8,
            "dropShadowAngle": 1.5,
            "dropShadowDistance": 6,
            "fill": ["black"],
            "fontSize": 55,
            "lineJoin": "round",
            "stroke": "white",
            "strokeThickness": 0,
            "trim": false,
            "whiteSpace": "pre",
            "wordWrap": false
        })
    }


}