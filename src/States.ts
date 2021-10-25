/**
 * StateMachine
 * Basic stateMachine (ish)! That allows the handling of events and/or state switching. More of a mediator tbh
 */
export class StateMachine {
    public static readonly IDLE_STATE: string = "IDLE";
    public static readonly SPINNING_STATE: string = "SPINNING";
    public static readonly WIN_PRESENTATION: string = "WINPRESENTATION";
    public currentState: String = "";
    private _context: PIXI.Container;

    public constructor(ctx: PIXI.Container) {
        this.currentState = StateMachine.IDLE_STATE;
        this._context = ctx;
    }


    public setState(state: string) {
        console.log("Changing current state: " + this.currentState + " to new state: " + state)
        this.currentState = state;
        this._context.emit(state);
    }

}
