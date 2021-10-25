import { ReelComponent } from "./reelComponent";
import { GameSymbol } from "./symbol";

export class WinPresentation
{

    private symbol1: number = 0;
    private symbol2: number = 0;
    private symbol3: number = 0;
    private symbol4: number = 0;
    private symbol5: number = 0;
    private symbol6: number = 0;
    private symbol7: number = 0;
    private symbol8: number = 0;

    private _reelComponent: ReelComponent;
    constructor(reelComponent: ReelComponent)
    {
        this._reelComponent = reelComponent;
    }

    public isWin()
    {
        for(let i:number = 0; i < this._reelComponent.reels.length; i++)
        {
            let symbols = this._reelComponent.getReelSymbols(i);
            this.parseSymbols(symbols as GameSymbol[]);
        }
    }

    protected parseSymbols(symbols: GameSymbol[])
    {
        symbols.forEach(symbol => {
            switch(symbol.name)
            {
                case "symbol_1":
                    this.symbol1++;
                    break;
                
                case "symbol_2":
                    this.symbol2++;
                    break;
                
                case "symbol_3":
                    this.symbol3++;
                    break;

                case "symbol_4":
                    this.symbol4++;
                    break;
                
                case "symbol_5":
                    this.symbol5++;
                    break;
                
                case "symbol_6":
                    this.symbol6++;
                    break;

                case "symbol_7":
                    this.symbol7++;
                        break;
                    
                case "symbol_8":
                    this.symbol8++;
                        break;
            }     
        });
    }


}