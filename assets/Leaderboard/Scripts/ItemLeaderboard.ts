import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemLeaderboard')
export class ItemLeaderboard extends Component {
    @property({
        type: Label,
        tooltip: 'Label name user'
    })
    private lbName: Label;

    @property({
        type: Label,
        tooltip: 'Label score'
    })
    private lbScore: Label;

    @property({
        type: Label,
        tooltip: 'Label order'
    })
    private lbOrder: Label;

    @property(Sprite)
    private spriteCup: Sprite;

    @property(Sprite)
    private spriteBar: Sprite;

    @property(Sprite)
    private spriteBackground: Sprite;

    @property(Node)
    private personalBackground: Node;

    private listColor: string[] = ['#F8D00032', '#DBDBDB32', '#FF660032'];
    private listColorCup: string[] = ['#F8D000', '#DBDBDB', '#FF6600']

    public init(name: string, score: string, order: number, isDirect: boolean): void {
        name = name.length > 10 ? `${name.slice(0, 9)}...` : name;

        this.lbName.string = name;
        this.lbScore.string = score;
        this.lbOrder.string = `${order + 1}`;

        this.spriteBackground.node.active = !isDirect;
        this.spriteCup.node.active = this.spriteBackground.node.active;
        this.personalBackground.active = !this.spriteBackground.node.active;
        this.lbOrder.node.active = !this.spriteBackground.node.active;;

        if (!isDirect) {
            let color: Color = new Color();
            let stringHex = this.listColor[order];
            Color.fromHEX(color, stringHex);

            let colorCup: Color = new Color();
            let stringCup = this.listColorCup[order];
            Color.fromHEX(colorCup, stringCup);

            this.spriteCup.color = colorCup;
            this.spriteBar.color = colorCup;
            this.spriteBackground.color = color;
        }
    }
}

