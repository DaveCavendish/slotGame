import * as PIXI from 'pixi.js';
import { AudioManager } from './AudioManager';
import { Button } from './Button';
import { ReelComponent } from './reelComponent';
import { StateMachine } from './States';
import { GameSymbol } from './symbol';
import { WinPresentation } from './WinPresentation';
export class Game
{

    private _stage: PIXI.Container;
    private _symbolSet: GameSymbol[] = [];
    private _reelSetComponent: ReelComponent | undefined;
    private _winPresentation: WinPresentation | undefined;
    private _button: Button = new Button();
    private _stateMachine: StateMachine;
    private _audioManager: AudioManager;

    private readonly renderer: PIXI.Renderer;
    //private _reelSetComponent: ReelComponent;
    public static readonly SYMBOLS_LENGTH: number = 8;

    constructor(stage: PIXI.Container, renderer: PIXI.Renderer){
        this._stage = stage;
        this.renderer = renderer;
        this._button.enabled = true;
        this._stateMachine = new StateMachine(this._stage);
        this._audioManager = new AudioManager(this._stage);
    }

    public async init()
    {
        this.addBackground();
        this.createButton();
        this.createAudioFiles();
        this.createSymbolSet();
        this._reelSetComponent = new ReelComponent(this._symbolSet, this._stateMachine, this._audioManager);
        this._winPresentation = new WinPresentation(this._reelSetComponent, this._stateMachine);
        await this._reelSetComponent.initReels();
        const reels = this._reelSetComponent.getReel();
        this._stage.addChild(reels);  
        this.addEventListeners();
    }

    public render()
    {
        this.renderer.render(this._stage);
    }

    public addBackground()
    {
        let texture = PIXI.Texture.from(`assets/stones.jpg`);
        let background = new PIXI.Sprite(texture);
        background.width = 1920;
        background.height = 1080;
        this._stage.addChild(background);
    }

    protected addEventListeners()
    {
        //execute this code when IDLE state is entered.
        this._stage.addListener(StateMachine.IDLE_STATE, ()=>{
            this._button.setEnabled(true);
        })
        //execute this code when SPINNING state is entered
        this._stage.addListener(StateMachine.SPINNING_STATE, ()=>{
            this._button.setEnabled(false);
            if(this._reelSetComponent)
            {
                this._reelSetComponent.dropReelsOut();
            }
        })

        this._stage.addListener(StateMachine.WIN_PRESENTATION, ()=>{
            this._winPresentation?.parseReels();
            this._winPresentation?.publishWin();
        })

        //TO-DO, WIN PRESENTATION?
    }

    protected createSymbolSet()
    {

        for(let i: number = 1; i < Game.SYMBOLS_LENGTH+1; i++)
        {
            let texture = PIXI.Texture.from(`assets/symbols/symbol_${i}.png`);
            let symbol = new GameSymbol(texture, `symbol_${i}`);
            this._symbolSet.push(symbol);
        }
    }

    protected createAudioFiles()
    {

        this._audioManager.addSound('onUiClick', 'assets/sounds/Start_Button.mp3');
        this._audioManager.addSound('onReel1Hit', 'assets/sounds/Reel_Stop_1.mp3');
        this._audioManager.addSound('onReel2Hit', 'assets/sounds/Reel_Stop_2.mp3');
        this._audioManager.addSound('onReel3Hit', 'assets/sounds/Reel_Stop_3.mp3');
        this._audioManager.addSound('onReel4Hit', 'assets/sounds/Reel_Stop_4.mp3');
        this._audioManager.addSound('onReel5Hit', 'assets/sounds/Reel_Stop_5.mp3');
    }

    protected createButton()
    {
        let texture = PIXI.Texture.from('assets/ui/btn_spin_disabled.png');
        let texture2 = PIXI.Texture.from('assets/ui/btn_spin_hover.png');
        let texture3 = PIXI.Texture.from('assets/ui/btn_spin_normal.png');
        let texture4 = PIXI.Texture.from('assets/ui/btn_spin_pressed.png');
        let sprite1 = new PIXI.Sprite(texture); sprite1.name = "btn_disabled";
        let sprite2 = new PIXI.Sprite(texture2); sprite2.name = "btn_hover";
        let sprite3 = new PIXI.Sprite(texture3); sprite3.name = "btn_normal";
        let sprite4 = new PIXI.Sprite(texture4); sprite4.name = "btn_pressed";
        this._button.addChild(sprite1, sprite2, sprite3, sprite4);
        this._button.y = 500;
        this._button.x = 1500;
        this._button.addLabel("SPIN")
        this._stage.addChild(this._button);
        this._button.on("pointerdown", (e: PIXI.interaction.InteractionEvent): void => this._onButtonDown(e))
    }

    protected _onButtonDown(e: PIXI.interaction.InteractionEvent) 
    {
        if(this._reelSetComponent && this._stateMachine.currentState === StateMachine.IDLE_STATE)
        {
            this._audioManager.playSound('onUiClick');
            this._stateMachine.setState(StateMachine.SPINNING_STATE);
        }
    }

}