import { ReelComponent } from "./reelComponent";
import { StateMachine } from "./States";
import { GameSymbol } from "./symbol";
import { gsap } from "gsap";

export class WinPresentation
{
    private static readonly SYMBOLS_TOTAL: number = 8;
    private symbolMap: Map<string, number> = new Map();

    private _reelComponent: ReelComponent;
    private _stateMachine: StateMachine;
    constructor(reelComponent: ReelComponent, stateMachine: StateMachine)
    {
        this._reelComponent = reelComponent;
        this._stateMachine = stateMachine;
        for(let i: number = 0; i < WinPresentation.SYMBOLS_TOTAL; i++)
        {
            this.symbolMap.set(`symbol_${i+1}`, 0);
        }
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
        this.symbolMap.forEach(symbol => {
            if(symbol >=3 )
            {
                console.log("WINNER");
                //publish win here.
            }
        })
        //short delay before we enable spin again
        gsap.delayedCall(0.5, ()=>{
            this.resetSymbolMap();
            this._stateMachine.setState(StateMachine.IDLE_STATE);
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
        symbols.forEach(symbol => {
            let value = this.symbolMap.get(symbol.symbolId);
            if (value || value === 0)
            {
                value = value + 1;
                this.symbolMap.set(symbol.symbolId, value);
            }
        });
    }


}