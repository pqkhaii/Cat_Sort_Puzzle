import { _decorator, Button, Component, director, find, Node, sys } from 'cc';
import { Constants } from '../Data/Constants';
import { AudioEntryController } from './AudioEntryController';
import { StoreAPI } from '../Loading/StoreAPI';
import { EntryView } from './EntryView';
import { DataUser } from '../Loading/DataUser';
const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {

    @property({type: AudioEntryController})
    private AudioEntryController: AudioEntryController;

    @property({type: EntryView})
    private EntryView: EntryView;

    @property({type: Button})
    private btnOnAudio: Button;

    @property({type: Button})
    private btnOffAudio: Button;

    @property({type: Button})
    private btnPlay: Button;

    protected async start(): Promise<void> {
        this.HandleAudioStorage();
        //handle tutorial
    }

    protected async onTouchPlay(): Promise<void> {
        this.btnPlay.interactable = false;
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.EntryView.Loading.active = true;
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        // this.EntryView.Loading.active = false;    
        director.loadScene(Constants.sceneGame);
    }

    protected onTouchOnAudio(): void {
        Constants.volumeGameStatic = true;

        this.AudioEntryController.AudioSource.play();
        this.AudioEntryController.settingAudio(1);

        this.btnOffAudio.node.active = false;
        this.btnOnAudio.node.active = true;
    }

    protected onTouchOffAudio(): void {
        Constants.volumeGameStatic = false;

        this.AudioEntryController.settingAudio(0);

        this.btnOffAudio.node.active = true;
        this.btnOnAudio.node.active = false;
    }

    protected HandleAudioStorage(): void {
        //handle audio
        if(Constants.volumeGameStatic === true){
            this.btnOffAudio.node.active = false;
            this.btnOnAudio.node.active = true;
            this.AudioEntryController.AudioSource.play();
            this.AudioEntryController.settingAudio(1);
        }
        else{
            this.btnOffAudio.node.active = true;
            this.btnOnAudio.node.active = false;
            this.AudioEntryController.AudioSource.stop();
            this.AudioEntryController.settingAudio(0);
        }
    }
}