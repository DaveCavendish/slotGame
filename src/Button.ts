import { interaction } from "pixi.js";
import * as PIXI from 'pixi.js';
import { NoEmitOnErrorsPlugin } from "webpack";
export class Button extends PIXI.Container
{

    private _normalState: PIXI.DisplayObject | undefined;
    private _hoverState: PIXI.DisplayObject | undefined;
    private _disabledState: PIXI.DisplayObject | undefined;
    private _pressedState: PIXI.DisplayObject | undefined;
    private _currentSprite: PIXI.DisplayObject | undefined;
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
        let label = new PIXI.Text(text);
        this.addChild(label);
        label.x = this.width/2 - label.width/2;
        label.y = this.height/2 - label.height;
    }


    protected onChildAdded(child: PIXI.DisplayObject)
    {
        if(!child.name)
        {return;}
        if(child.name.endsWith("_normal")) {this._normalState = child;
        this._normalState.visible = true;}
        else if(child.name.endsWith("_disabled")) this._disabledState = child;
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
        this.showState("_disabled");
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
}