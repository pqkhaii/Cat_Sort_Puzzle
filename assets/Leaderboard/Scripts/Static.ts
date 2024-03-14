import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
export type DataUser = {
    dataLevel: Array<number>,
    checkLog: Object,
    highScore: number
}
@ccclass('Static')
export class Static {
    public static dataUser: DataUser = {
        dataLevel: [0, 0, 0, 0, 0],
        checkLog: {},
        highScore: 0
    }
    public static readonly colors = ['#cd1818', '#ff6173', '#6afff6', '#cc46fb', '#ff8009', '#4fb4f9', '#59de47'];

    public static readonly SCENE_NAME = {
        BEGIN: 'Begin',
        ENTRY: 'Entry',
        GAME: 'Game',
        LEVEL: 'Level'
    }

    public static readonly NODE_NAME = {
        GameClient: 'GameClient'
    }
    public static level = 0;

    public static stage = 0;

    public static music: boolean = true;

    public static effect: boolean = true;

    public static dataLevel: number[] = [0, 0, 0, 0, 0];

    public static readonly KEY_LOCALSTORAGE = {
        Status_Level: 'knots_data_dots',
        Last_User: 'knots_last_user'
    }

    public static readonly ANIMATION_NAME = {
        ReverseSlime: 'ReSlimeAnim',
        OffAudio: 'AnimOff',
        OpenBackground: 'BackAnimAppear',
        ShakeSlime: 'SlimeShake'
    }

    public static readonly START_STAGE: number = 4;
}

