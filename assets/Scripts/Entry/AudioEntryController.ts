import { _decorator, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioEntryController')
export class AudioEntryController extends Component {
    @property({type: AudioSource})
    private audioSource: AudioSource = null;

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }

    public get AudioSource() : AudioSource {
        return this.audioSource;
    }
    
    public set AudioSource(v : AudioSource) {
        this.audioSource = v;
    }
}

