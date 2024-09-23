import { Howl } from 'howler';

class SoundManager {
    constructor() {
        this.sounds = {};  // 儲存音效的物件
        this.queue = [];    // 排程音效的隊列
        this.isPlaying = false; // 用來追蹤音效是否正在播放
        this.initSounds();
    }
    // 初始化並註冊所有音效
    initSounds() {
        // this.registerSound('correct', '../assets/Effects/CorrectAnswer.mp3');
        // this.registerSound('wrong', '../assets/Effects/WrongAnswer.mp3');
        // this.registerSound('background', '/sounds/background.mp3');
        // 你可以根據需求添加更多音效
    }

    // 註冊音效並預載入
    registerSound(name, src) {
        if (!this.sounds[name]) {
            this.sounds[name] = new Howl({
                src: [src],
                preload: true // 預載入音效
            });
        }
    }

    // 播放音效，是否立即播放還是加入排程
    playSound(name, immediate = true) {
        const sound = this.sounds[name];

        if (!sound) {
            console.error(`音效 ${name} 未註冊！`);
            return;
        }

        if (immediate) {
            sound.play();
        } else {
            this.queue.push(sound); // 加入排程
            this.processQueue(); // 處理排程
        }
    }

    // 處理排程中的音效，依序播放
    processQueue() {
        if (this.isPlaying || this.queue.length === 0) return;

        const nextSound = this.queue.shift();
        this.isPlaying = true;

        nextSound.play();
        nextSound.on('end', () => {
            this.isPlaying = false;
            this.processQueue(); // 播放下一個音效
        });
    }
}

export const soundManager = new SoundManager();