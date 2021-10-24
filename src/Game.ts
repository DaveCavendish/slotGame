
import { TweenMax } from 'gsap';
import * as PIXI from 'pixi.js';
export class Game
{

    private _sprite8: PIXI.Sprite;
    constructor(stage: any){
        let rootStage = new PIXI.Container();

        let texture = PIXI.Texture.from("assets/symbols/symbol_8.png");
        this._sprite8 = new PIXI.Sprite(texture);
        stage.addChild(this._sprite8);
    }


    public moveImage()
    {

    }

}