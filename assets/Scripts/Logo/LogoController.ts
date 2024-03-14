import { _decorator, Component, director, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LogoController')
export class LogoController extends Component {

    @property({type: Node})
    private logoAnimation: Node = null;

    start() {
        let animationComponent = this.logoAnimation.getComponent(sp.Skeleton);
        animationComponent.setCompleteListener(this.onAnimationComplete)
    }

    protected onAnimationComplete(track): void {
        if (track.animation.name === 'Option 1') {
            director.loadScene('Loading');
        }
    }
}

