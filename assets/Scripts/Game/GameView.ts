import { _decorator, Component, Node, Animation, Prefab, instantiate, random, randomRangeInt, randomRange, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {

    @property({type: Node})
    private gameOptionNode: Node;

    @property({type: Node})
    private winPopupNode: Node;

    @property({type: Node})
    private tick: Node;

    @property({type: Node})
    private tutorialGame: Node;

    @property({type: Node})
    private nodeLoading: Node;

    @property({type: Node})
    private nodeConfirmLevel: Node;

    @property({type: Node})
    private nodeConfirmAddBranch: Node;

    @property({type: Node})
    private nodeBackground: Node;

    @property({type: [Prefab]})
    private clouds: Prefab[] = [];

    private cloudPool: Node[] = [];

    //leaderboard
    @property({type: [Node]})
    private listLeaderboard: Node[] = [];

    //time
    @property({type: Label})
    private timeLabel: Label = null;

    @property({type: Label})
    private scoreLabel: Label = null;

    @property({type: Label})
    private scoreLabelOver: Label = null;

    @property({type: Label})
    private highScoreLabel: Label = null;

    /** ===== GET / SET ===== */
    public get GameOptionNode() : Node {
        return this.gameOptionNode;
    }
    public set GameOptionNode(v : Node) {
        this.gameOptionNode = v;
    }

    public get TimeLabel() : Label {
        return this.timeLabel;
    }
    public set TimeLabel(v : Label) {
        this.timeLabel = v;
    }

    //leaderboard
    public get ListLeaderboard() : Node[] {
        return this.listLeaderboard;
    }
    public set ListLeaderboard(v : Node[]) {
        this.listLeaderboard = v;
    }
    /** ===================== **/

    protected start(): void {
        this.createClouds();
        this.handleTutorial(false);
        this.handletick(false);
        this.winPopupNode.active = false;
        this.handleGameOption(false);
        this.handleWinGamePopup(false);
        this.handleLoading(false);
    }

    protected update(dt: number): void {
        this.moveClouds(dt);
    }

    protected createClouds(): void {
        for(let i = 0; i < 5; i++){
            const cloud = instantiate(this.clouds[randomRangeInt(0,2)])
            cloud.parent = this.nodeBackground;
            this.cloudPool.push(cloud);
            const posX = 920 + (i * 380)
            const posY = randomRange(260, 400);
            cloud.setPosition(posX, posY, 0);
        }
    }

    protected moveClouds(dt: number): void {
        for(let i = 0; i < this.cloudPool.length; i++){
            const cloud = this.cloudPool[i];
            var posX = cloud.position.x;
            var posY = cloud.position.y;

            if(posX <= -1200){
                posX = 1200;
                posY = randomRange(260, 400);
            }
            else{
                posX -= 50 * dt;
            }
            cloud.setPosition(posX, posY, 0);
        }
    }

    public handleGameOption(status: boolean): void {
        if(status === true){
            this.gameOptionNode.active = true;
        }
        else{
            this.gameOptionNode.active = false;
        }
    }

    public handleWinGamePopup(status: boolean): void {
        if(status === true){
            this.winPopupNode.active = true;
        }
        else{
            this.winPopupNode.active = false;
        }
    }

    public handleTutorial(status: boolean){
        if(status === true){
            this.tutorialGame.active = true;
        }
        else{
            this.tutorialGame.active = false;
        }
    }

    public handletick(status: boolean){
        if(status === true){
            this.tick.active = true;
        }
        else{
            this.tick.active = false;
        }
    }

    public handleLoading(status: boolean): void {
        if(status === true){
            this.nodeLoading.active = true;
        }
        else{
            this.nodeLoading.active = false;
        }
    }

    public handleConfirmLevel(status: boolean): void {
        if(status === true){
            this.nodeConfirmLevel.active = true;
        }
        else{
            this.nodeConfirmLevel.active = false;
        }
    }

    public handleConfirmAddBranch(status: boolean): void {
        if(status === true){
            this.nodeConfirmAddBranch.active = true;
        }
        else{
            this.nodeConfirmAddBranch.active = false;
        }
    }

    public showScore(num: number): void {
        this.scoreLabel.string = `SCORE: ${num}`
    }

    public showResults(score: number, highScore: number): void {
        this.scoreLabelOver.string = `SCORE: ${score}`;
        this.highScoreLabel.string = `HIGH SCORE: ${highScore}`;
    }
}