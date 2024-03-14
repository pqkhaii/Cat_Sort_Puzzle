import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    
    private isAddBranch: boolean = false;
    private isGameOver: boolean = false;
    private stopUpdate: boolean = false;

    private timer: number = 0;
    private currentScore: number = 10;

    private isPauseChecklog: boolean = true;

    public get IsGameOver() : boolean {
        return this.isGameOver;
    }
    public set IsGameOver(v : boolean) {
        this.isGameOver = v;
    }

    public get StopUpdate() : boolean {
        return this.stopUpdate;
    }
    public set StopUpdate(v : boolean) {
        this.stopUpdate = v;
    }

    public get IsAddBranch() : boolean {
        return this.isAddBranch;
    }
    public set IsAddBranch(v : boolean) {
        this.isAddBranch = v;
    }
       
    public get Timer() : number {
        return this.timer;
    }
    public set Timer(v : number) {
        this.timer = v;
    }
    
    public get CurrentScore() : number {
        return this.currentScore;
    }
    public set CurrentScore(v : number) {
        this.currentScore = v;
    }

    public get IsPauseChecklog(): boolean {
        return this.isPauseChecklog;
    }
    public set IsPauseChecklog(value : boolean) {
        this.isPauseChecklog = value;
    }
}