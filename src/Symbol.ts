import * as PIXI from 'pixi.js';
export class GameSymbol extends PIXI.Container
{

    public symbolId: string = "";
    public height: number = 0;
    public texture: PIXI.Texture;
    private _symbolSprite: PIXI.Sprite;


    constructor(texture: PIXI.Texture, symbolId: string)
    {
        super();

        this._symbolSprite = new PIXI.Sprite(texture);
        this.symbolId = symbolId;
        this.height = this._symbolSprite.height;
        this.texture = texture;
        this.addChild(this._symbolSprite);
    }

    public set isScatter(bool: boolean)
    {
        this.isScatter = bool;
    }

    public get isScatter(): boolean
    {
        return this.isScatter;
    }

    public getTexture(): PIXI.Texture
    {
        return this.texture;
    }


}