import { interaction } from "pixi.js";
import * as PIXI from 'pixi.js';
import { NoEmitOnErrorsPlugin, PrefetchPlugin } from "webpack";
export class Button extends PIXI.Container
{

    private _normalState: PIXI.DisplayObject | undefined;
    private _hoverState: PIXI.DisplayObject | undefined;
    private _disabledState: PIXI.DisplayObject | undefined;
    private _pressedState: PIXI.DisplayObject | undefined;
    private _currentSprite: PIXI.DisplayObject | undefined;
    private _spinLabel: PIXI.Text | undefined;
    public enabled: boolean = true;
    public constructor()
    {
        super();
        this.on("pointerdown", (e: interaction.InteractionEvent): void => this._onButtonDown(e))
        this.on("pointerover", (e: interaction.InteractionEvent): void => this._onButtonHover(e))
        this.on("pointerout", (e: interaction.InteractionEvent): void => this._onButtonOut(e))
        this.on("pointerup", (e: interaction.InteractionEvent): void => this._onButtonUp(e))
        this.buttonMode = true;
        this.interactive = true;
    }

    protected _onButtonDown(e: interaction.InteractionEvent)
    {
        if(this.enabled)
        this.showState("_pressed");
    }

    protected _onButtonHover(e: interaction.InteractionEvent)
    {
        if(this.enabled)
        this.showState("_hover");
        //this.emit("buttonover")
    }

    protected _onButtonOut(e: interaction.InteractionEvent)
    {
        if(this.enabled)
        this.showState("_normal");
    }

    protected _onButtonUp(e: interaction.InteractionEvent)
    {
        if(this.enabled)
        this.showState("_disabled");
    }

    public addChild(...children: PIXI.DisplayObject[]): PIXI.DisplayObject
    {
        children.forEach((child) => this.onChildAdded(child))
        return super.addChild(...children);
    }

    public addLabel(text: string)
    {
        this._spinLabel = new PIXI.Text(text, this.labelStyle);
        this.addChild(this._spinLabel);
        this._spinLabel.x = this.width/2 - this._spinLabel.width/2 + 10;
        this._spinLabel.y = this.height/2 + 40;
    }


    protected onChildAdded(child: PIXI.DisplayObject)
    {
        if(!child.name)
        {return;}
        if(child.name.endsWith("_normal")) {this._normalState = child;
        this._normalState.visible = true;}
        else if(child.name.endsWith("_disabled")) {this._disabledState = child; this._disabledState.alpha = 0.5;} 
        else if(child.name.endsWith("_hover")) this._hoverState = child;
        else if(child.name.endsWith("_pressed")) this._pressedState = child;
    }

    public setVisibility(bool: boolean)
    {
        if(bool)
        {
            if(this._hoverState)
            this._hoverState.visible = true;
            if(this._disabledState)
            this._disabledState.visible = true;
            if(this._pressedState)
            this._pressedState.visible = true;
            if(this._normalState)
            this._normalState.visible = true;
        }
        else{
            if(this._hoverState)
            this._hoverState.visible = false;
            if(this._disabledState)
            this._disabledState.visible = false;
            if(this._pressedState)
            this._pressedState.visible = false;
            if(this._normalState)
            this._normalState.visible = false;
        }
    }

    public setEnabled(enable: boolean)
    {
        this.enabled = enable;
        this.interactive = enable;
        this.buttonMode = enable;
        if(!enable)
        {
            this.showState("_disabled");
            if(this._spinLabel)
            this._spinLabel.visible = false;
        }
        else
        {
            this.showState("_normal");
            if(this._spinLabel)
            this._spinLabel.visible = true;
        }
    }


    protected showState(state: string)
    {
        this.setVisibility(false);
        switch(state)
        {
            case "_pressed":
                if(this._pressedState) this._pressedState.visible = true;
            break;

            case "_hover":
                if(this._hoverState) this._hoverState.visible = true;
            break;

            case "_disabled":
                if(this._disabledState) this._disabledState.visible = true;
            break;

            case "_normal":
                if(this._normalState) this._normalState.visible = true;
            break;

        }
    }


    protected get labelStyle(): PIXI.TextStyle
    {
        return new PIXI.TextStyle({
            "align": "center",
            "dropShadow": true,
            "dropShadowAlpha": 0.8,
            "dropShadowAngle": 1.5,
            "dropShadowDistance": 6,
            "fill": ["white", "#fdea35", "#ff9500"],
            "fillGradientStops": [0.3, 0.6, 0.9],
            "fontSize": 45,
            "stroke": "#240a00",
            "strokeThickness": 3,
            "trim": false,
            "whiteSpace": "pre",
            "wordWrap": false
        })
    }
}