import { GameSymbol } from "./symbol";
import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { Game } from "./Game";
import { toJS } from "mobx";
export class ReelComponent 
{

    private static readonly REEL_ROWS: number = 3;
    private static readonly REEL_COLUMNS: number = 5;
    private _reelSetContainer: PIXI.Container;
    public reels: PIXI.Container[] = [];
    public isSpinning: boolean = false;
    private _symbolSet: GameSymbol[] = [];
    constructor(symbolSet: GameSymbol[])
    {
        this._reelSetContainer = new PIXI.Container();
        this._symbolSet = symbolSet;
    }


    public initReels()
    {
        this.createStrips();
    }

    public getReel()
    {
        return this._reelSetContainer;
    }

    private createStrips()
    {
        for(let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++)
        {
            let reel = new PIXI.Container();
            reel.name = `reel_${i}`;
            this.reels.push(reel);
            reel.x = 200 + i * this._symbolSet[0].width;
            reel.y = 150;
            for(let j: number = 2; j > -1; j--)
            {
                let symbol = new PIXI.Sprite(this._symbolSet[this.randomIntFromInterval(0, 7)].texture);
                reel.addChild(symbol);
                symbol.y += j * symbol.height;
                symbol.visible = true;
            }
            this._reelSetContainer.addChild(reel);
        }
    }

    public recreateStrips()
    {
        for(let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++)
        {
            let reel = this._reelSetContainer.getChildAt(i) as PIXI.Container;
            for(let j: number = 0; j < ReelComponent.REEL_ROWS; j++)
            {
                let symbol = new PIXI.Sprite(this._symbolSet[this.randomIntFromInterval(0, 7)].texture);
                reel.addChild(symbol);
                symbol.visible = false;
                symbol.y = -symbol.height;
            }
        } 
    }

    public dropReelsIn()
    {

        for(let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++)
        {
            gsap.delayedCall(0.2+0.3*i, ()=>{
            let reel = this._reelSetContainer.getChildByName(`reel_${i}`) as PIXI.Container;
            let delay: number = 0;
            for(let j: number = 0; j < 3; j++)
            {
                let symbol = reel.getChildAt(j) as GameSymbol
                let dropDist = symbol.height*2;
                if(symbol.y < 0)
                {
                    dropDist = symbol.y*-1 + symbol.height*2;
                }
                dropDist = symbol.height*2 - symbol.y;
                this.dropSymbol(dropDist, dropDist-j*symbol.height, delay, symbol, false, i);
                delay += 0.3;
            }
            
        })
    }

    //reels now finished dropping? End game.
    }

    public dropReelsOut()
    {
        this.isSpinning = true;
        for(let i: number = 0; i < ReelComponent.REEL_COLUMNS; i++)
        {
            gsap.delayedCall(0.2+0.3*i, ()=>{
                let reel = this._reelSetContainer.getChildByName(`reel_${i}`) as PIXI.Container;
                let delay: number = 0;
                for(let j: number = 0; j < 3; j++)
                {
                    let dropDist: number = 0;
                    let symbol = reel.getChildAt(j) as GameSymbol
                    symbol.visible = true;
                    dropDist = 1200 - symbol.y;
                    this.dropSymbol(1200, dropDist, delay, symbol, true, i);
                    delay += 0.3;
                }
            })
        }
    }

    public dropSymbol(maxDist: number, dropDist: number, delay: number, symbol: GameSymbol, isDrop: boolean = false, column: number)
    {
        const speed = dropDist/maxDist;
        symbol.visible = true;
        if(speed ===0)
        {
            console.log("Dave:" + speed);         
        }
        if(delay)
        {
            gsap.delayedCall(delay, ()=>{
                gsap.to(symbol, {duration: speed, y: symbol.y + dropDist, onComplete:()=>{
                    if(isDrop)
                    {
                        if(symbol.parent.children.length === 1 && column === 4)
                        {
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
                    if(!isDrop)
                    {
                        //if we're not dropping and we are at the last symbol then the spin is complete. Move onto winPresentation or whatever next.
                        if(symbol === symbol.parent.getChildAt(2) && column === 4)
                        {
                            this.isSpinning = false;

                            //add a state change here? If we get round to doing a stateMachine e.g REELS_IDLE
                        }
                    }
                }})
            })
        }
        else{
            gsap.to(symbol, {duration: speed, y: symbol.y + dropDist, onComplete:()=>{
                if(isDrop)
                {
                    symbol.parent.removeChild(symbol);
                    symbol.visible = false;
                    symbol.destroy();
                }
            } })
        }
    }

    public getReelSymbols(reel: number)
    {
        return this.reels[0].children;
    }

    public getIndependentReel(reel: number)
    {
        return this.reels[reel];
    }

    private randomIntFromInterval(min: number, max: number) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
}