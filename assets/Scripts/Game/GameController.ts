import { _decorator, Camera, Component, EventTouch, Input, input, instantiate, Node, Prefab, Layout, sys, Animation, SpriteFrame, Sprite, Button, director, game, Label, find, tween, Vec3, Color } from 'cc';
import { AudioController } from './AudioController';
import { Constants } from '../Data/Constants';
import { Data } from '../Data/LevelData';
import { GameView } from './GameView';
import { StoreAPI } from '../Loading/StoreAPI';
import { DataUser } from '../Loading/DataUser';
import { GameModel } from './GameModel';
import { LeaderboardHandle } from '../../Leaderboard/Scripts/LeaderboardHandle';
const { ccclass, property } = _decorator;

let matchId: string;

@ccclass('GameController')
export class GameController extends Component {

    @property({type: GameView})
    private GameView: GameView;

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: AudioController})
    private AudioController: AudioController;

    @property({type: Button})
    private btnOnAudio: Button;

    @property({type: Button})
    private btnOffAudio: Button;

    @property({type: Button})
    private btnNextLevel: Button;

    @property({type: Button})
    private btnRestartLevel: Button;

    @property({type: Button})
    private btnAddBranch: Button;

    @property({type: Node})
    private nodeButton: Node;

    @property({type: Label})
    private levelLabel: Label;

    @property({type: Node})
    private completeGame: Node;

    @property({type: Prefab})
    private branchPrefab: Prefab;
    
    @property({type: Node})
    private nodeBranch: Node;

    @property({type: Prefab})
    private catPrefab: Prefab[] = [];

    private branchPool: Node[] = [];
    private branchSelectedStates: boolean[] = [];

    private catPool: Node[] = [];

    private countClick: number = 0;
    private catMoving: Node[] = []

    private currentLevelIndex: number = 0;

    private idLogMatch: any;

    @property({type: LeaderboardHandle})
    private LeaderboardHandle: LeaderboardHandle;

    //API
    private gameClient: any;
    private matchData: any;
    private userID: string

    protected onLoad(): void {
        console.log(DataUser.dataUser.data.highScore)
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.matchData = gameClientParams.matchData;
        this.userID = this.gameClient.user.citizen.getCitizenId();
    }

    protected async start(): Promise<void> {
        this.startMatchLog();
        this.nodeButton.active = true;
        this.HandleAudioStorage();
        this.handleLevel();
        this.GameView.showScore(Constants.TEMP_SCORE);
        if(DataUser.dataUser.data.highScore === undefined){
            DataUser.dataUser.data.highScore = 0;
            await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
                .then((response: any) => {});
        }
    }

    protected async update(deltaTime: number): Promise<void> {
        let _this = this;
        if(this.GameModel.IsGameOver === true){ //Save Score API;
            this.nodeButton.active = false;
            this.GameModel.IsGameOver = false;
            this.GameModel.StopUpdate = true;

            this.showResults();
            this.GameView.handleLoading(true);

            this.GameModel.IsPauseChecklog = false;
            this.logMatch({score: Constants.TEMP_SCORE});
            await _this.gameClient.match
                    .completeMatch(this.matchData, {score: Constants.TEMP_SCORE})
                    .then((data) => {
                        this.LeaderboardHandle.show(this.gameClient, this.userID);
                    })
                    .catch((error) => console.log(error));
            this.GameView.handleLoading(false);

            this.GameView.handleWinGamePopup(true);
            this.nextLevel();
            this.AudioController.onAudio(1);
        }

        if(this.GameModel.StopUpdate === false){
            this.CheckScale();
            this.timer(deltaTime);
        }
    }

    //checklog
    protected logMatch(data: Object): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.gameClient.match.logMatch(this.matchData.matchId, data).catch((e) => console.log(e));
    }

    protected startMatchLog(): void {
        this.idLogMatch = setInterval(() => {
            if(this.GameModel.IsPauseChecklog === false){
                clearInterval(this.idLogMatch);
                return;
            }
            this.logMatch({score: Constants.TEMP_SCORE});
        }, 1000);
    }

    protected async getLeaderboard(){
        await this.gameClient.leaderBoard.getList(0)
            .then((data: any) => {
                var lengthItem = 0;
                
                if(data.length < 3){
                    lengthItem = data.length;
                }
                else{
                    lengthItem = 3;
                }

                for(let i = 0; i < lengthItem; i++){
                    
                    const getUserId = data[i].userId;
                    const getName: string = data[i].metadata.citizenName;
                    const getScore = data[i].point;

                    this.GameView.ListLeaderboard[i].active = true;
                    const name = this.GameView.ListLeaderboard[i].getChildByName('LabelName');
                    const score = this.GameView.ListLeaderboard[i].getChildByName('LabelScore');

                    if(getUserId === this.userID){
                        this.GameView.ListLeaderboard[i].getComponent(Sprite).color = new Color('#EB276E');
                    }
                    else{
                        this.GameView.ListLeaderboard[i].getComponent(Sprite).color = new Color('#0DAF88');
                    }

                    name.getComponent(Label).string = getName.toString();
                    score.getComponent(Label).string = getScore.toString();
                }
            });
    }

    // protected handleScore(): void {
    //     if(this.GameModel.IsAddBranch === false){
    //         this.GameModel.CurrentScore = Math.round(10 * (1 - (this.GameModel.Timer/ Constants.MAX_TIME)));
    //     }
    //     else{
    //         this.GameModel.CurrentScore = Math.round(10 * (1 - (this.GameModel.Timer/ Constants.MAX_TIME)))
    //         this.GameModel.CurrentScore -= Math.round(this.GameModel.CurrentScore * (25 / 100))
    //     }
        
    //     if(this.GameModel.CurrentScore <= 1){
    //         this.GameModel.CurrentScore = 1;
    //     }
        
    //     this.GameView.showScore(Constants.TEMP_SCORE);
    // }

    protected async showResults(): Promise<void> {
        if(this.GameModel.IsAddBranch === false){
            this.GameModel.CurrentScore = Math.round(10 * (1 - (this.GameModel.Timer/ Constants.MAX_TIME)));
        }
        else{
            this.GameModel.CurrentScore = Math.round(10 * (1 - (this.GameModel.Timer/ Constants.MAX_TIME)))
            this.GameModel.CurrentScore -= Math.round(this.GameModel.CurrentScore * (25 / 100))
        }
        
        if(this.GameModel.CurrentScore <= 1){
            this.GameModel.CurrentScore = 1;
        }

        Constants.TEMP_SCORE += this.GameModel.CurrentScore;

        if(Constants.TEMP_SCORE > DataUser.dataUser.data.highScore){
            DataUser.dataUser.data.highScore = Constants.TEMP_SCORE;
            await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
                .then((response: any) => {});
        }

        // console.log(DataUser.dataUser.data.highScore)
        this.GameView.showResults(Constants.TEMP_SCORE, DataUser.dataUser.data.highScore)
    }

    protected timer(deltaTime: number): void {
        if(this.GameModel.Timer <= 180){
            this.GameModel.Timer += 1 * deltaTime;
            this.GameView.TimeLabel.string = `${Math.floor(this.GameModel.Timer)}s`;

            if(this.GameModel.Timer <= 60){
                this.GameView.TimeLabel.color = new Color('#0F7929');
            }
            else if(this.GameModel.Timer > 60 && this.GameModel.Timer <= 120){
                this.GameView.TimeLabel.color = new Color('#FFFF00');
            }else{
                this.GameView.TimeLabel.color = new Color('#FF3D00');
            }
        }
    }


    protected async handleLevel(): Promise<void> {
        this.GameView.handleLoading(true);
        this.currentLevelIndex = Constants.LEVEL; 
        if(this.currentLevelIndex !== 0){
            this.GameView.handleTutorial(false);
        }
        else{
            this.btnAddBranch.node.active = false;
            this.GameView.handleTutorial(true);
        }

        this.levelLabel.string = `Level ${this.currentLevelIndex + 1}`;

        this.createBranch(Data[this.currentLevelIndex].cats.length);
        this.spawnCatForLevel();
        this.addCatToBranch();

        this.GameView.handleLoading(false);
    }

    protected setNumOfCat(num: number): void {
        switch(num){
            case 0:
                this.catPool.push(null)
                break;
            case 1:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 2:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 3:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 4:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 5:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 6:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 7:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 8:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 9:
                this.createCat(this.catPrefab[num-1]);
                break;
            case 10:
                this.createCat(this.catPrefab[num-1]);
                break;
            default: 
                break;
        }
    }

    private spawnCatForLevel(): void {
        for(let i = 0; i < Data[this.currentLevelIndex].cats.length; i++) {
            for(let j = 0; j < 4; j++) {
                var data = Data[this.currentLevelIndex].cats[i][j];
                this.setNumOfCat(data);
            }
        }
    }

    protected async nextLevel(): Promise<void> {
        if(this.hasNextLevel()){
            Data[this.currentLevelIndex + 1];
            Constants.LEVEL = Data[this.currentLevelIndex].id;

        }
        else{
            Constants.LEVEL = 0;
            this.completeGame.active = true;
        }
    }

    protected hasNextLevel(): boolean {
        return this.currentLevelIndex < Data.length - 1;
    }

    protected getLastCatSecondBranch(children: Node[]) {
        if(children && children.length > 0) {
            const lastCatIndex = children.length - 1;
            return children[lastCatIndex];
        } 
        else{
            return null; 
        }
    }

    protected getLastCatFirstBranch(children: Node[]): Node[] {
        const lastCats = [];
    
        if(children && children.length > 0) {
            const lastCatIndex = children.length - 1;
            const lastCatName = children[lastCatIndex].name;
            
            for(let i = children.length - 1; i >= 0; i--) {
                const currentCat = children[i];
                
                if(currentCat.name === lastCatName) {
                    lastCats.push(currentCat);
                } 
                else{
                    break;
                }
            }
        }
        
        return lastCats;
    }
    
    protected onTouchBranch(branch: Node): void {
        this.countClick++;
        //first click
        if(this.countClick === 1){
            if(this.currentLevelIndex === 0){
                this.GameView.handletick(true);
            }
            var lastCatFirstBranch = this.getLastCatFirstBranch(branch.children);
            for (const lastCat of lastCatFirstBranch) {
                lastCat.getComponent(Sprite).enabled = false;
                lastCat.getChildByName('outline').active = true;
                this.catMoving.push(lastCat)
            }
        }
        //second click
        else{
            if(this.currentLevelIndex=== 0){
                this.GameView.handleTutorial(false);
            }
            this.countClick = 0;
            var lastCatSecondBranch = this.getLastCatSecondBranch(branch.children);

            if(lastCatSecondBranch){
                var lastCatSecondBranchName = lastCatSecondBranch.name;
            }

            for(let i = 0; i < this.catMoving.length; i++) {
                const lastNameCat = this.catMoving[i].name;

                if ((lastNameCat === lastCatSecondBranchName || !lastCatSecondBranchName) && branch.children.length < 4) {
                    this.catMoving[i].setScale(0, 0, 0)

                    this.catMoving[i].parent = branch;

                    tween(this.catMoving[i])
                    .to(0.4, { scale: new Vec3(-1, 1)}, {easing: "backOut"})
                    .start();

                    this.catMoving[i].getComponent(Sprite).enabled = true;
                    this.catMoving[i].getChildByName('outline').active = false;
                }
                else{
                    this.AudioController.onAudio(3);
                    this.catMoving[i].getComponent(Sprite).enabled = true;
                    this.catMoving[i].getChildByName('outline').active = false;
                }
            }
            
            if(this.checkWinningCondition()){
                this.GameModel.IsGameOver = true;
            }

            this.catMoving = [];
        }
    }
    
    protected checkWinningCondition(): boolean {
        let allBranchesHaveEnoughNodes = true;
        for(let i = 0; i < this.branchPool.length; i++){
            const branch = this.branchPool[i];
    
            const nodeNameCounts = {};
    
            // Count the occurrences of each node name in the branch
            for(let j = 0; j < branch.children.length; j++){
                const childNode = branch.children[j];
                const nodeName = childNode.name;
    
                if(nodeNameCounts[nodeName]){
                    nodeNameCounts[nodeName]++;
                } 
                else{
                    nodeNameCounts[nodeName] = 1;
                }
            }
            
            // Check if any node name appears 4 times
            for (const nodeName in nodeNameCounts) {
                if (nodeNameCounts[nodeName] !== 4) {
                    allBranchesHaveEnoughNodes = false;
                    break;
                }
            }
        }

        return allBranchesHaveEnoughNodes;
    }

    protected CheckScale(): void {
        for(let i = 0; i < this.branchPool.length; i ++){
            var getPosX = this.branchPool[i].position.x;
            if(getPosX > 0){
                this.branchPool[i].setScale(-1, 1, 1);
            }
            else{
                this.branchPool[i].setScale(1, 1, 1);
            }
        }
    }

    protected createCat(prefab: Prefab): void {
        const CatChild = instantiate(prefab);
        this.catPool.push(CatChild);
    }

    protected createBranch(number: number): void {
        for(let i = 0; i < number; i ++){
            const branchChild = instantiate(this.branchPrefab);
            branchChild.parent = this.nodeBranch;

            branchChild.addComponent(Layout)
            branchChild.getComponent(Layout).type = Layout.Type.HORIZONTAL;
            branchChild.getComponent(Layout).horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
            branchChild.getComponent(Layout).paddingRight = 50;
            branchChild.getComponent(Layout).paddingLeft = 25;
            branchChild.getComponent(Layout).spacingX = -5;

            this.branchSelectedStates[i] = false;

            branchChild.on(Node.EventType.TOUCH_START, () => {
                this.onTouchBranch(branchChild);
            }, this);

            this.branchPool.push(branchChild)
        }
    }

    protected addBranch(): void {
        if(this.GameModel.IsAddBranch === false){
            this.btnAddBranch.interactable = false;
            this.GameModel.IsAddBranch = true;
            this.btnAddBranch.getComponent(Sprite).color = new Color('#A79F9F');

            const branchChild = instantiate(this.branchPrefab);
            branchChild.parent = this.nodeBranch;
    
            branchChild.addComponent(Layout)
            branchChild.getComponent(Layout).type = Layout.Type.HORIZONTAL;
            branchChild.getComponent(Layout).horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
            branchChild.getComponent(Layout).paddingRight = 50;
            branchChild.getComponent(Layout).paddingLeft = 25;
            branchChild.getComponent(Layout).spacingX = -5;
    
            branchChild.on(Node.EventType.TOUCH_START, () => {
                this.onTouchBranch(branchChild);
            }, this);

            this.branchPool.push(branchChild)

            branchChild.setScale(0,0,0);
            
            if(this.nodeBranch.children.indexOf(branchChild) % 2 === 0){
                tween(branchChild)
                .to(0.4, { scale: new Vec3(1, 1, 1)}, {easing: "backOut"})
                .start();
            }
            else{
                tween(branchChild)
                .to(0.4, { scale: new Vec3(-1, 1, 1)}, {easing: "backOut"})
                .start();
            }
        }
    }

    protected addCatToBranch(): void {
        const branchCount = this.branchPool.length;
        const CatCount = this.catPool.length;
        const CatsPerBranch = 4;

        let CatIndex = 0;
        for(let i = 0; i < branchCount; i++) {
            const branch = this.branchPool[i];

            for(let j = 0; j < CatsPerBranch; j++) {
                if(CatIndex < CatCount){
                    const Cat = this.catPool[CatIndex];
                    if(Cat === null){
                        //no progress
                    }
                    else{
                        Cat.parent = branch;
                    }
                    CatIndex++;
                }
                else{
                    break;
                }
            }
        }
    }

    protected HandleAudioStorage(): void {
        //handle audio
        if(Constants.volumeGameStatic === true){
            this.btnOnAudio.node.active = true;
            this.btnOffAudio.node.active = false;
            this.AudioController.AudioSource.play();
            this.AudioController.settingAudio(1);
        }
        else{
            this.btnOnAudio.node.active = false;
            this.btnOffAudio.node.active = true;
            this.AudioController.settingAudio(0);
        }
    }

    /** ======================================================== HANDLE BUTTON ======================================================== */

    protected onTouchOnAudio(): void {
        Constants.volumeGameStatic = true;

        this.AudioController.AudioSource.play();
        this.AudioController.settingAudio(1);

        this.btnOffAudio.node.active = false;
        this.btnOnAudio.node.active = true;
    }

    protected onTouchOffAudio(): void {
        Constants.volumeGameStatic = false;

        this.AudioController.settingAudio(0);

        this.btnOffAudio.node.active = true;
        this.btnOnAudio.node.active = false;
    }

    protected onTouchHome(): void {
        clearInterval(this.idLogMatch);
        director.loadScene(Constants.sceneEntry);
    }

    protected onTouchCancel(): void {
        this.GameView.handleGameOption(false);
    }

    protected onTouchOption(): void {
        this.GameView.handleGameOption(true);
    }

    //level
    protected onTouchRestartLevel(): void {
        this.GameView.handleConfirmLevel(true);
    }

    protected async onTouchConfirmRestartLevel(): Promise<void> {
        this.btnRestartLevel.interactable = false;
        this.AudioController.onAudio(2);
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        Constants.TEMP_SCORE = 0;
        Constants.LEVEL = 0;
        director.loadScene(Constants.sceneGame);
    }

    protected onTouchExitPopupLevel(): void {
        this.GameView.handleConfirmLevel(false);
    }

    //branch
    protected onTouchAddBranch(): void {
        this.GameView.handleConfirmAddBranch(true);
    }

    protected onTouchConfirmAddBranch(): void {
        this.addBranch();
        this.GameView.handleConfirmAddBranch(false);
    }

    protected onTouchExitPopupAddBranch(): void {
        this.GameView.handleConfirmAddBranch(false);
    }

    protected async onTouchNextLevel(): Promise<void> {
        this.btnNextLevel.interactable = false;
        this.AudioController.onAudio(2);
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        director.loadScene(Constants.sceneGame);
    }
}