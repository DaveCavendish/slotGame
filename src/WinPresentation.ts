import { ReelComponent } from "./reelComponent";
import { StateMachine } from "./States";
import { GameSymbol } from "./symbol";
import { gsap } from "gsap";
import * as PIXI from 'pixi.js';
/**
 * WinPresentation
 * Parses each reel in the window and figures out how many of each symbol have landed.
 */
export class WinPresentation extends PIXI.Container
{
    private static readonly SYMBOLS_TOTAL: number = 8;
    private symbolMap: Map<string, number> = new Map();

    private _reelComponent: ReelComponent;
    private _stateMachine: StateMachine;
    private _winLabel: PIXI.Text | undefined;
    private _winValue: PIXI.Text | undefined;
    constructor(reelComponent: ReelComponent, stateMachine: StateMachine)
    {
        super();
        this._reelComponent = reelComponent;
        this._stateMachine = stateMachine;
        for(let i: number = 0; i < WinPresentation.SYMBOLS_TOTAL; i++)
        {
            this.symbolMap.set(`symbol_${i+1}`, 0);
        }
        this.createWinText("WIN!", "4 X SYMBOL_1");
    }

    public parseReels(): void
    {
        for(let i:number = 0; i < this._reelComponent.reels.length; i++)
        {
            let symbols = this._reelComponent.getReelSymbols(i);
            this.parseSymbols(symbols as GameSymbol[]);
        }
    }


    public publishWin(): void
    {
        let delay: number = 0.5;
        this.symbolMap.forEach((symbol, string) => {
            if(symbol >=3 )
            {
                //very basic method to see if the symbol has appeared on at least 3 reels
                if(this._reelComponent.reelHasSymbol(0, string) && this._reelComponent.reelHasSymbol(1, string) && this._reelComponent.reelHasSymbol(2, string))
                {
                    console.log("WINNER");
                    delay += 1;
                    this.createWinText("WIN!", symbol + "X " + string.toUpperCase());
                    if(this._winLabel)
                    {
                        this._winLabel.alpha = 0;
                        this._winLabel.visible = true;
                        gsap.to([this._winLabel, this._winValue], {duration: 0.5, alpha: 1})
                    }
                }
                //publish win here.
            }
        })
        //short delay before we enable spin again, add 1 second to delay if there is a win
        gsap.delayedCall(delay, ()=>{
            this.resetSymbolMap();
            if(this._winLabel)
            gsap.to([this._winLabel, this._winValue], {duration: 0.5, alpha: 0, onComplete:()=>{
                this._stateMachine.setState(StateMachine.IDLE_STATE);
            }})
        })
    }

    protected resetSymbolMap(): void
    {
        this.symbolMap.clear();
        for(let i: number = 0; i < WinPresentation.SYMBOLS_TOTAL; i++)
        {
            this.symbolMap.set(`symbol_${i+1}`, 0);
        } 
    }

    // doesn't work with lines, it works in clusters. If you have 3 or more symbols on the reels you are awarded a win.
    protected parseSymbols(symbols: GameSymbol[]): void
    {
        let hm = this.symbolMap;
        symbols.forEach(symbol => {
            let value = this.symbolMap.get(symbol.symbolId);
            if (value || value === 0)
            {
                value = value + 1;
                this.symbolMap.set(symbol.symbolId, value);
                console.log(this.symbolMap);
            }
        });
    }

    protected createWinText(text: string, valueText: string)
    {
        this._winLabel = new PIXI.Text(text, this.labelStyle);
        this.addChild(this._winLabel);
        this._winLabel.width = 400;
        this._winLabel.height = 300;
        this._winLabel.x = 1450;
        this._winLabel.y = 100;
        
        this._winLabel.visible = true;
        this._winLabel.alpha = 1;

        this._winValue = new PIXI.Text(valueText, this.valueStyle);
        this.addChild(this._winValue);
        this._winValue.x = 1460;
        this._winValue.y = 380;
        
        this._winValue.visible = true;
        this._winValue.alpha = 1;
    }

    protected get labelStyle(): PIXI.TextStyle
    {
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

    protected get valueStyle(): PIXI.TextStyle
    {
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