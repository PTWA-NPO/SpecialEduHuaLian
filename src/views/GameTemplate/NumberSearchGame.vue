<template>
  <div class="game-container">
    <div class="game">
      <v-stage ref="stage" :config="stageSize" @click="handleMouseClick" @touchstart="handleMouseClick">
        <v-layer ref="layer">
          <v-image :config="imageConfig" />
          <v-circle v-for="(circle, index) in circles" :key="index" :config="circle" />
        </v-layer>
      </v-stage>
      <div class="game__controls">
        <p class="game__question">{{ GameData.Text }}</p>
        <div class="game__actions">
          <div class="game__sound">
            <button class="game__sound-btn" @click="playNumberSound">
              <img src="@/assets/GamePic/SpeakerIcon.png" alt="Speaker Icon" />
            </button>
          </div>
          <div class="game__navigation">
            <button class="button-pre" @click="previousQuestion">上一題</button>
            <button class="button-nxt" @click="nextQuestion">下一題</button>
          </div>
        </div>
        <p class="game__remaining">剩餘題數：{{ remainingQuestions }}</p>
        <div class="progress">
          <div class="progress-bar" role="progressbar" :style="{ width: progressBarWidth }"
            aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGameAssets } from '@/utilitys/get_assets.js';
import { getSystemAssets } from '@/utilitys/get_assets.js';

import * as speech from '@/utilitys/readtext.js';

export default {
  name: 'FindTheItem',
  data() {
    return {
      questionNum: 0,
      rightAnswerCount: 0,
      correctlyAnsweredQuestions: [],
      randomQuestionOrder: [],
      stageSize: {
        width: 600,
        height: 400
      },
      imageConfig: {
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        image: null
      },
      circles: []
    };
  },
  props: {
    GameData: {
      type: Object,
      required: true
    },
    GameConfig: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  created() {
    const image = new window.Image();
    image.src = getGameAssets(this.id, this.GameData.img);
    image.onload = () => {
      const aspectRatio = image.width / image.height;
      this.imageConfig.width = this.stageSize.width;
      this.imageConfig.height = this.stageSize.width / aspectRatio;
      this.imageConfig.image = image;
    };

    this.randomQuestionOrder = this.generateRandomOrder(this.GameData.ObjNum);
    this.playNumberSound()
  },
  methods: {
    playNumberSound() {
      const number = this.randomQuestionOrder[this.questionNum];
      var numSound = new Audio();
      numSound.src = getSystemAssets(`${number}.mp3`, 'read-numbers');
      numSound.oncanplaythrough = function () {
        numSound.play();
      };
    },
    handleMouseClick() {
      const mousePos = this.$refs.stage.getNode().getPointerPosition();
      const questionNum = this.randomQuestionOrder[this.questionNum];
      if (this.checkAnswer(questionNum, mousePos.x, mousePos.y)) {
        this.addCircle(questionNum);
        this.answerCorrectly();
        this.nextQuestion();
      } else {
        this.$emit('play-effect', 'WrongSound');
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
    checkAnswer(questionNum, posX, posY) {
      const obj = this.GameData.Objs[questionNum];
      const tolerance = this.GameData.tolerance;
      return (
        posX >= obj.xRange[0] - tolerance && posX <= obj.xRange[1] + tolerance &&
        posY >= obj.yRange[0] - tolerance && posY <= obj.yRange[1] + tolerance
      );
    },
    answerCorrectly() {
      this.rightAnswerCount++;
      this.correctlyAnsweredQuestions[this.questionNum] = 1;
      this.$emit('play-effect', 'CorrectSound');
    },
    addCircle(questionNum) {
      const obj = this.GameData.Objs[questionNum];
      const radius = Math.sqrt(((obj.xRange[1] - obj.xRange[0]) ** 2) + ((obj.yRange[1] - obj.yRange[0]) ** 2)) / 2;

      this.circles.push({
        x: (obj.xRange[0] + obj.xRange[1]) / 2,
        y: (obj.yRange[0] + obj.yRange[1]) / 2,
        radius: radius,
        stroke: 'red',
        strokeWidth: 2
      });
    },
    nextQuestion() {
      this.questionNum++;
      if (this.gameOver()) {
        this.$emit('next-question', true);
      } else {
        this.skipAnsweredQuestions();
        this.playNumberSound();
      }
    },
    previousQuestion() {
      this.questionNum--;
      if (this.questionNum < 0) {
        this.questionNum = 10;
      }
      this.playNumberSound();
    },
    skipAnsweredQuestions() {
      const totalQuestions = this.GameData.ObjNum;
      while (this.correctlyAnsweredQuestions[this.questionNum] && this.questionNum < totalQuestions - 1) {
        this.questionNum++;
      }
    },
    gameOver() {
      return this.rightAnswerCount >= this.GameData.ObjNum;
    }
  },
  computed: {
    progressPercentage() {
      return (this.rightAnswerCount / this.GameData.ObjNum) * 100;
    },
    progressBarWidth() {
      return `${this.progressPercentage}%`;
    },
    remainingQuestions() {
      return this.GameData.ObjNum - this.rightAnswerCount;
    }
  }
};
</script>

<style scoped lang="scss">
.game-container {
  display: flex;
  justify-content: center;
}

.game {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.game__controls {
  display: flex;
  flex-direction: column;
  padding: 1em;
  margin-top: 3rem;
  align-items: flex-start;
}

.game__question {
  text-align: center;
  font-size: 2rem;
  width: 100%;
}

.game__actions {
  display: flex;
  width: 100%;
  gap: 1rem;
}

.game__sound {
  flex: 1;
}

.game__sound-btn {
  width: 100%;
  height: 100%;

  img {
    width: 4rem;
    height: auto;
  }
}

.game__navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  button {
    scale: 1;
  }
  button:hover {
    scale: 1.05;
    transition: $transition-time;
  }
}

.game__actions button {
  transition: background-color 0.2s;
}

.game button:active {
  background-color: #606c38;
}

.game__remaining {
  font-size: 1.7rem;
  margin-top: 1rem;
}

.progress {
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
}

.game button {
  font-size: 2rem;
  border: 2px solid #606c38;
  background-color: transparent;
  border-radius: 10px;

}

.progress-bar {
  height: 20px;
  background-color: #4caf50;
  transition: width 0.5s ease;
}
</style>
