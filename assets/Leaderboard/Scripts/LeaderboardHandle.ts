import { _decorator, Component, instantiate, Node, Prefab } from 'cc';

import { ItemLeaderboard } from './ItemLeaderboard';


const { ccclass, property } = _decorator;

@ccclass('LeaderboardHandle')
export class LeaderboardHandle extends Component {
    // @property({
    //     type: GameCenterController,
    //     tooltip: 'Game center'
    // })
    // private gameCenter: GameCenterController;

    @property({
        type: Prefab,
        tooltip: 'Prefab item leaderboard'
    })
    private prefabItem: Prefab;

    @property({
        type: Node
    })
    private container: Node;

    @property({
        type: ItemLeaderboard
    })
    private personalItem: ItemLeaderboard;

    public show(gameClient: any, userId): void {
        this.node.active = true;
        this.container.removeAllChildren();

        gameClient.leaderBoard.getList(0).then((data) => {
            console.log(data)
            data.map((item, index) => {
                if (index > 2) return;

                let el = instantiate(this.prefabItem);
                this.container.addChild(el);
                el.setPosition(0, -index * 110);
                el.getComponent(ItemLeaderboard).init(item.metadata.citizenName, `${item.point}`, item.index, false);
            });

            let lastChild = this.container.children[this.container.children.length - 1];
            this.personalItem.node.setPosition(0, (lastChild.position.y + 75) * this.personalItem.node.scale.x);

            let current = data.find((item) => item.userId === userId);
            if (current) {
                this.personalItem.init(current.metadata.citizenName, `${current.point}`, current.index, true);
                this.personalItem.node.active = true;
            }
        });
    }

    public hidden(): void {
        this.node.active = false;
    }
}

