import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({type: AudioSource})
    private audioSource: AudioSource = null;

    @property({type: [AudioClip]})
    private clips: AudioClip[] = [];

    public get AudioSource() : AudioSource {
        return this.audioSource;
    }
    
    public set AudioSource(v : AudioSource) {
        this.audioSource = v;
    }

    public onAudio(index: number): void {
        let clip: AudioClip = this.clips[index];
        this.audioSource.playOneShot(clip);
    }

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }

}

