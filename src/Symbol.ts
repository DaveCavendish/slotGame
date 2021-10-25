import * as PIXI from 'pixi.js';
export class GameSymbol extends PIXI.Container
{

    private _symbolId: String = "";
    private _symbolSprite: PIXI.Sprite;
    public height: number = 0;
    public texture: PIXI.Texture;


    constructor(symbolSprite: PIXI.Sprite, symbolId: String)
    {
        super();
        this._symbolSprite = symbolSprite;
        this._symbolId = symbolId;
        this.height = symbolSprite.height;
        this.texture = symbolSprite.texture;
        this.addChild(this._symbolSprite);
    }

    public getSymbolID(): String
    {
        return this._symbolId;
    }


}