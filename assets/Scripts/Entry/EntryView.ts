import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EntryView')
export class EntryView extends Component {
    
    @property({type: Node})
    private nodeLoading: Node;

    public get Loading() : Node {
        return this.nodeLoading;
    }
    public set Loading(v : Node) {
        this.nodeLoading = v;
    }

    protected start(): void {
        this.nodeLoading.active = false;
    }
}