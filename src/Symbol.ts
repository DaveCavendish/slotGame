import * as PIXI from 'pixi.js';
/**
 * GameSymbol
 * Basic symbol class that can be used to create new sprites for reelComponent. Option to set a symbol as a scatter to later be used in WinPResentation.
 */
export class GameSymbol extends PIXI.Container {

    public symbolId: string = "";
    public height: number = 0;
    public texture: PIXI.Texture;
    private _symbolSprite: PIXI.Sprite;
    private _colourMatrix: PIXI.filters.ColorMatrixFilter = new PIXI.filters.ColorMatrixFilter();

    constructor(texture: PIXI.Texture, symbolId: string) {
        super();

        this._symbolSprite = new PIXI.Sprite(texture);
        this.symbolId = symbolId;
        this.height = this._symbolSprite.height;
        this.texture = texture;
        this.addChild(this._symbolSprite);
        this.setMask(1);
    }

    public setMask(num: number)
    {
        if(this.filters)
        {
            this.filters.pop();
        }
        this.filters = [this._colourMatrix];
        this._colourMatrix.reset();
        this._colourMatrix.brightness(num, true);
    }

    public set reel(reel: number) {
        this.reel = reel;
    }

    public get reel(): number {
        return this.reel;
    }

    public set isScatter(bool: boolean) {
        this.isScatter = bool;
    }

    public get isScatter(): boolean {
        return this.isScatter;
    }

    public getTexture(): PIXI.Texture {
        return this.texture;
    }


}