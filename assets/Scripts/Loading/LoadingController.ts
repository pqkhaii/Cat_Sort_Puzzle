import { _decorator, Component, director, find, Node } from 'cc';
import { StoreAPI } from './StoreAPI';
import { Constants } from '../Data/Constants';
import GameClient from '@onechaintech/gamesdk';
import { DataUser } from './DataUser';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
    
    public gameClient;
    private gameId: string = '64ba2c10798ddd0f4a2d92a7';
    private apiKey: string = 'eefdf7c8-a562-4780-9231-a86d0d613729';
    
    public async start() : Promise<void> {
        let parameters = find("GameClient");
        
        if (parameters === null) {
            let parameters = new Node("GameClient");
            if (this.gameClient === undefined) {
                this.gameClient = new GameClient(this.gameId, this.apiKey, window.parent, {dev: true});
                await this.gameClient.initAsync()
                .then( async (data) => {
                    //Get current user id
                    let userID = this.gameClient.user.citizen.getCitizenId();

                    //Get gamedata from server
                    await this.gameClient.user.data.getGameData().then((response) => {
                        //Save data
                        if (response.data[`${userID}`] !== undefined){
                            DataUser.dataUser = response.data[`${userID}`];
                        }    
                    })
                    .catch(async (e) => {
                        console.log('Error at get game data: ', e);
                    })

                    let gameClientParams = parameters.addComponent(StoreAPI);
                    gameClientParams.gameClient = this.gameClient;
                    director.addPersistRootNode(parameters);

                    director.loadScene(Constants.sceneEntry);
                })
                .catch((err) => console.log(err));
            }
        }
    }

}

