import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants extends Component {

    public static readonly sceneEntry: string = 'Entry';
    public static readonly sceneGame: string = 'Game';
    public static readonly sceneMenu: string = 'Loading';

    public static volumeGameStatic: boolean = true;

    public static TEMP_SCORE: number = 0;
    public static LEVEL: number = 0;
    public static readonly MAX_TIME: number = 180;
}

