<template>
  <div class="container">
    <div class="gameAndQuestion">
      <!-- Life bar section -->
      <!-- <div class="life-bar">
      <div class="life-container">
        <img v-for="index in totalLives" :key="index" :src="index <= remainingLives ? heartImageUrl : deadHeartImageUrl"
          class="heart-icon" />
      </div>
      <div class="volume-control">
        <img :src="isMuted ? muteIconUrl : unmuteIconUrl" @click="toggleMute" class="volume-icon" />
        <div v-if="showVolumeSlider" class="slider-container">
          <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="adjustVolume"
            class="volume-slider" />
        </div>
      </div>
    </div> -->

      <!-- Conveyor belt section -->
      <div class="box ratio-7">
        <div class="conveyor-belt" :class="{ paused: isPaused }" :style="conveyorStyle">
          <div class="conveyor-item" v-for="(item, index) in currentQuestions" :key="index">
            <div class="question-container">
              <component :is="this.GameData.Question[currentQuestions[index]].name"
                :Data="this.GameData.Question[currentQuestions[index]].Data" :ID="this.id"></component>
              <!-- <p class="question-text">{{ item.Question }}</p> -->
            </div>
          </div>
        </div>
      </div>
      <!-- Spacer between conveyor belt and answer buttons -->
      <!-- <div class="spacer"></div> -->
      <!-- Answer buttons or home page -->
      <div class="box ratio-3" v-if="!showHomePage">
        <div class="button-container">
          <button v-for="(selection, index) in this.GameData.Question[
            currentQuestions[currentQuestionIndex]
          ].Selections" :key="index" :class="[
            'big-button',
            { 'wrong-answer': wrongAnswerIndex === index },
          ]" @click="handleAnswer(index)">
            {{ selection }}
          </button>
        </div>
      </div>
      <div class="box ratio-3" v-if="showHomePage">
        <div class="button-container">
          <button class="big-button" @click="startQuiz">開始遊戲</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import heartImageUrl from "@/assets/images/pics/heart.png";
import deadHeartImageUrl from "@/assets/images/pics/dead_heart.png";
import muteIconUrl from "@/assets/images/pics/mute.png";
import unmuteIconUrl from "@/assets/images/pics/unmute.png";
import gameplayMusic from "@/assets/sounds/game_sounds/gameplay-music.mp3";
import clickSound from "@/assets/sounds/game_sounds/click-sound.mp3";
import wrongSound from "@/assets/sounds/game_sounds/wrong_sound_effect.mp3";
import { getComponents } from "@/utilitys/get-components.js";
import { soundManager } from '@/utilitys/sound-manager.js';

export default {
  name: "QuizComponent",
  data() {
    return {
      heartImageUrl,
      deadHeartImageUrl,
      gameplayMusic,
      muteIconUrl,
      unmuteIconUrl,
      clickSound,
      wrongSound,
      showHomePage: true,
      totalLives: 3,
      remainingLives: 3,
      backgroundMusicVolume: 0.01,
      clickSoundVolume: 0.7,
      wrongSoundVolume: 1.0,
      isMuted: false,
      showVolumeSlider: false,
      volume: 0.15,
      wrongAnswerIndex: null,
      // GameData: {
      //   關卡1: [
      //     { Question: "3分鐘", Selections: ["180秒", "160秒", "90秒"], AnswerIndex: 0 },
      //     { Question: "9分鐘", Selections: ["540秒", "450秒", "54秒"], AnswerIndex: 0 },
      //     { Question: "5分鐘", Selections: ["300秒", "270秒", "30秒"], AnswerIndex: 0 },
      //     { Question: "8分鐘", Selections: ["480秒", "450秒", "48秒"], AnswerIndex: 0 },
      //     { Question: "7分鐘", Selections: ["420秒", "120秒", "84秒"], AnswerIndex: 0 }
      //   ],
      //   關卡2: [
      //     { Question: "12分鐘", Selections: ["780秒", "720秒", "660秒"], AnswerIndex: 1 },
      //     { Question: "15分鐘", Selections: ["980秒", "900秒", "990秒"], AnswerIndex: 1 },
      //     { Question: "10分鐘", Selections: ["660秒", "600秒", "106秒"], AnswerIndex: 1 },
      //     { Question: "13分鐘", Selections: ["720秒", "780秒", "870秒"], AnswerIndex: 1 },
      //     { Question: "11分鐘", Selections: ["600秒", "660秒", "110秒"], AnswerIndex: 1 }
      //   ],
      //   關卡3: [
      //     { Question: "6分鐘10秒", Selections: ["370秒", "310秒", "610秒"], AnswerIndex: 0 },
      //     { Question: "3分鐘27秒", Selections: ["207秒", "270秒", "327秒"], AnswerIndex: 0 },
      //     { Question: "2分鐘33秒", Selections: ["153秒", "135秒", "123秒"], AnswerIndex: 0 },
      //     { Question: "4分鐘15秒", Selections: ["255秒", "250秒", "252秒"], AnswerIndex: 0 },
      //     { Question: "5分鐘45秒", Selections: ["345秒", "354秒", "545秒"], AnswerIndex: 0 }
      //   ],
      //   關卡4: [
      //     { Question: "1小時", Selections: ["36分鐘", "66分鐘", "60分鐘"], AnswerIndex: 2 },
      //     { Question: "4小時", Selections: ["245分鐘", "400分鐘", "240分鐘"], AnswerIndex: 2 },
      //     { Question: "2小時", Selections: ["360分鐘", "240分鐘", "120分鐘"], AnswerIndex: 2 },
      //     { Question: "3小時", Selections: ["150分鐘", "160分鐘", "180分鐘"], AnswerIndex: 2 },
      //     { Question: "5小時", Selections: ["360分鐘", "330分鐘", "300分鐘"], AnswerIndex: 2 }
      //   ],
      //   關卡5: [
      //     { Question: "3小時5分鐘", Selections: ["305分鐘", "185分鐘", "165分鐘"], AnswerIndex: 1 },
      //     { Question: "1小時10分鐘", Selections: ["110分鐘", "70分鐘", "90分鐘"], AnswerIndex: 1 },
      //     { Question: "2小時8分鐘", Selections: ["138分鐘", "128分鐘", "148分鐘"], AnswerIndex: 1 },
      //     { Question: "4小時11分鐘", Selections: ["241分鐘", "251分鐘", "215分鐘"], AnswerIndex: 1 },
      //     { Question: "2小時25分鐘", Selections: ["155分鐘", "145分鐘", "165分鐘"], AnswerIndex: 1 }
      //   ]
      // },
      currentQuestions: [], //題目陣列位置
      currentQuestionIndex: 0, //目前的題目
      isPaused: true,
    };
  },
  props: {
    GameData: {
      type: Object,
      required: true,
    },
    GameConfig: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    conveyorStyle() {
      const numQuestions = this.currentQuestions.length;
      const widthPercentage = numQuestions * 100; // Each question contributes 100% to the width
      const translateX = (this.currentQuestionIndex / numQuestions) * 100;

      return {
        width: `${widthPercentage}%`,
        transform: `translateX(-${translateX}%)`,
        transition: "transform 1.5s linear",
        whiteSpace: "nowrap",
      };
    },
  },
  methods: {
    startQuiz() {
      this.playBackgroundMusic();
      this.playCkickSound();
      this.currentQuestionIndex = 0;
      this.isPaused = false;
      this.wrongAnswerIndex = null;
      this.currentQuestions = this.generateRandomOrder(
        this.GameData.Question.length
      );
      setTimeout(() => {
        this.pauseConveyor();
        this.showHomePage = false;
      });
    },
    handleAnswer(selectedIndex) {
      var ansIndex =
        this.GameData.Question[this.currentQuestions[this.currentQuestionIndex]]
          .AnswerIndex;
      this.isPaused = false;
      if (selectedIndex === ansIndex) {
        this.$emit("add-record", [
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[ansIndex],
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[selectedIndex],
          "正確",
        ]);
        this.currentQuestionIndex += 1;
        if (this.currentQuestionIndex === this.GameData.Question.length) {
          this.$emit("next-question", true);
        } else {
          this.$emit("play-effect", "CorrectSound");
        }
        this.wrongAnswerIndex = null;
        // this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.currentQuestions.length;
      } else {
        this.$emit("add-record", [
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[ansIndex],
          this.GameData.Question[
            this.currentQuestions[this.currentQuestionIndex]
          ].Selections[selectedIndex],
          "錯誤",
        ]);
        this.remainingLives -= 1;
        this.wrongAnswerIndex = selectedIndex;
        this.$emit("play-effect", "WrongSound");
        // this.playSound(this.wrongSound, this.wrongSoundVolume);
      }
      setTimeout(() => {
        this.pauseConveyor();
      }, 2000);
    },
    pauseConveyor() {
      this.isPaused = true;
    },
    playCkickSound() {
      soundManager.playSound('trackClickSound', true,false);
    },
    playBackgroundMusic() {
      soundManager.playSound('trackBackgroundMusic', true,true);
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
      this.$refs.backgroundMusic.volume = this.isMuted ? 0 : 0.15;
      if (this.isMuted) {
        this.$refs.backgroundMusic.pause();
      } else {
        this.$refs.backgroundMusic.play();
      }
    },
    adjustVolume(event) {
      this.volume = event.target.value;
      if (!this.isMuted) {
        this.$refs.backgroundMusic.volume = this.volume;
      }
    },
    generateRandomOrder(total) {
      const order = [];
      while (order.length < total) {
        let randomIndex = Math.floor(Math.random() * total);
        if (!order.includes(randomIndex)) {
          order.push(randomIndex);
        }
      }
      return order;
    },
  },
  components: {
    TextOnly: getComponents("TextOnly"),
    ImageContainer: getComponents("ImageContainer"),
  },
  created() {
    soundManager.registerSound('trackBackgroundMusic', `${gameplayMusic}`, true);
    soundManager.registerSound('trackClickSound', `${clickSound}`, true);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.gameAndQuestion {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
}

.life-bar {
  width: 100%;
  height: 50px;
  /* background-color: #f0f0f0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.life-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.heart-icon {
  width: 40px;
  height: 38px;
  margin: 7px;
}

.box {
  flex: 1;
  background-size: cover;
  background-position: center;
  position: relative;
}

.ratio-7 {
  flex: 7;
  position: relative;
  overflow: hidden;
}

.conveyor-belt {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.conveyor-item {
  width: calc(100% / 3);
  height: 100%;
  background-image: url("@/assets/images/pics/track2.png");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-container {
  height: 90%;
  width: 90%;
  padding: 0;
  background-color: transparent;
  border-radius: 10px;
  z-index: 10;
}

.question-text {
  font-size: 7.5rem;
  color: #ffffff;
  text-align: center;
}

.ratio-3 {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
}

.button-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.big-button {
  flex: 2;
  margin: 10px;
  font-size: calc(2rem + 1vw);
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.big-button:hover {
  background-color: #45a049;
}

.big-button.wrong-answer {
  background-color: #f44336;
}

.volume-control {
  display: flex;
  align-items: center;
  position: absolute;
  top: -5px;
  right: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 20;
}

.volume-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.slider-container {
  display: none;
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}

.volume-control:hover .slider-container {
  display: block;
}

.volume-slider {
  width: 100px;
}

@media (min-height: 600px) {
  .question-container {
    height: 80%;
  }
}
</style>
