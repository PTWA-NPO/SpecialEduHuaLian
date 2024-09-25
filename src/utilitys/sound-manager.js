import { Howl } from 'howler';
let queue = [];
class SoundManager {
    constructor() {
        this.sounds = {};  // 儲存音效的物件
        this.isPlaying = false; // 用來追蹤音效是否正在播放
        this.initSounds();
    }
    // 初始化並註冊所有音效
    initSounds() {
    }

    // 註冊音效並預載入
    registerSound(name, src, isStream = false) {
        if (!this.sounds[name]) {
            this.sounds[name] = new Howl({
                src: [src],
                preload: true, // 預載入音效
                html5: isStream  // 對大型音檔啟用流式播放
            });
        }
    }

    // 播放音效，是否立即播放還是加入排程
    playSound(name, immediate = true, loop = false) {
        const sound = this.sounds[name];

        if (!sound) {
            console.error(`音效 ${name} 未註冊！`);
            return;
        }

        // 設置是否循環播放
        sound.loop(loop);

        if (immediate) {
            sound.play();
        } else {
            queue.push(sound); // 加入排程
            this.processQueue(); // 處理排程
        }
    }

    // 處理排程中的音效，依序播放
    processQueue() {
        if (this.isPlaying || queue.length === 0) return;

        const nextSound = queue.shift();
        this.isPlaying = true;

        nextSound.play();
        nextSound.on('end', () => {
            this.isPlaying = false;
            this.processQueue(); // 播放下一個音效
        });
    }

    stopAllSounds() {
        for (const name in this.sounds) {
          const sound = this.sounds[name];
          sound.loop(false);  // 確保將 loop 設置為 false
          sound.stop();       // 停止播放
        }
    }
}

export const soundManager = new SoundManager();