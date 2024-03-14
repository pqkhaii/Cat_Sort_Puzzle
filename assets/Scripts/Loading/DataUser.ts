import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export type DataGame = {
    data: {
        highScore: number,
        logGame: object
    }
}

export class DataUser {
    public static dataUser: DataGame = { 
        data:{ 
            highScore: 0,
            logGame: {}
        } 
    }
}