<template>
  <div class="quetioncontainer">
    <div class="quation__picture">
      <component
        :is="this.GameData.name"
        :Data="this.GameData.Data"
        :ID="this.id"
      ></component>
    </div>
    <div class="quation__text">
      <h2>{{ GameData.Question }}</h2>
    </div>
  </div>
  <div class="gameContainer">
    <div id="canvasContainer">
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configLane"></v-rect>
        </v-layer>

        <v-layer>
          <v-image :config="configCar"></v-image>
        </v-layer>

        <v-layer>
          <passage
            v-for="i in map"
            :Y="i[1]"
            :w="laneWidth"
            :l="configKonva.width"
            :option="GameData.Options[i[0]]"
            :speed="speed"
            @end="end"
            @onClick="moveOnClick"
          >
          </passage>
        </v-layer>
      </v-stage>
    </div>
    <div id="btnContainer">
      <img :src="upBtn" class="controlBtn" @click="move(1)" />
      <br />
      <img :src="rightBtn" class="controlBtn" @click="move(0)" />
      <br />
      <img :src="downBtn" class="controlBtn" @click="move(-1)" />
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";
import { getComponents } from "@/utilitys/get-components.js";

const carImg = document.createElement("img");
carImg.src = GamesGetAssetsFile("MA_Pub_12", "RacingCar.png");

export default {
  components: {
    passage: defineAsyncComponent(() => import("@/components/passage.vue")),
    ImageContainer: getComponents("ImageContainer"),
  },
  data() {
    return {
      configKonva: {
        width: 800,
        height: 400,
      },

      configCar: {
        image: carImg,
        x: 50,
        y: 0,
        width: 150,
        height: 150,
        key: 0,
      },

      configLane: {
        x: 0,
        y: 0,
        width: 800,
        height: 400,
        fill: "gray",
        stroke: "gray",
      },

      map: [
        [0, 0, false],
        //[225, false],
      ],

      laneWidth: 0,

      game: true,

      speed: 1,

      upBtn: GamesGetAssetsFile(this.id, "arrowUp.jpg"),
      rightBtn: GamesGetAssetsFile(this.id, "arrowRight.jpg"),
      downBtn: GamesGetAssetsFile(this.id, "arrowDown.jpg"),
    };
  },

  props: {
    GameData: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  emits: ["play-effect", "add-record", "next-question"],

  beforeMount() {
    var gameWidth = document.getElementById("GameContainer").clientWidth;
    //var canvasCon = document.getElementById("canvasContainer");
    this.configKonva.width = Math.floor(gameWidth * 0.8);
    this.configKonva.height = Math.floor(this.configKonva.width / 2);
    this.configLane.width = this.configKonva.width;
    this.configLane.height = this.configKonva.height;

    this.options = this.GameData.Options.length;
    this.ans = this.GameData.Answer;
    //console.log(this.GameData.Options.length);

    window.addEventListener("keydown", this.input);
    this.laneWidth = Math.floor(this.configKonva.height / this.options);
    for (var i = 1; i < this.options; i++) {
      //console.log(i);
      this.map.push([i, this.laneWidth * i, false]);
    }
    this.map[this.ans][2] = true;
    this.configCar.height = Math.floor(this.laneWidth * 0.8);
    this.configCar.width = this.configCar.height;
    this.configCar.y = this.laneWidth / 2 - this.configCar.height / 2;
    //this.randomPassage();
  },

  mounted() {
    var btnCon = document.getElementById("btnContainer");
    btnCon.style.height = this.configKonva.height + "px";
  },

  methods: {
    input(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 38:
        case 87:
          this.move(1);
          break;

        case 40:
        case 83:
          this.move(-1);
          break;

        case 32:
          this.move(0);
          break;
      }
    },
    move(key) {
      if (key == 1) this.configCar.key--;
      else if (key == -1) this.configCar.key++;
      else if (key == 0) {
        this.speed = 10;
        window.removeEventListener("keydown", this.input);
      }
      if (this.configCar.key <= 0) this.configCar.key = 0;
      else if (this.configCar.key >= this.options)
        this.configCar.key = this.options - 1;
      //console.log(this.configCar.key);
      this.configCar.y =
        this.map[this.configCar.key][1] +
        this.laneWidth / 2 -
        this.configCar.height / 2;
    },
    end() {
      if (this.game) {
        this.game = false;
        if (this.configCar.key == this.ans) {
          //this.configTemp.text = "SUCCESS";
          this.$emit("play-effect", "CorrectSound");
          this.$emit("add-record", [
            this.GameData.Options[this.GameData.Answer],
            this.GameData.Options[this.configCar.key],
            "正確",
          ]);
          this.$emit("next-question");
        } else {
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.GameData.Options[this.GameData.Answer],
            this.GameData.Options[this.configCar.key],
            "錯誤",
          ]);
          setTimeout(this.replay, 1000);
        }
      }
    },

    replay() {
      this.game = true;
      this.speed = 1;
      window.addEventListener("keydown", this.input);
    },

    moveOnClick(Y) {
      this.configCar.key = Y / this.laneWidth;
      this.configCar.y =
        this.map[this.configCar.key][1] +
        this.laneWidth / 2 -
        this.configCar.height / 2;
    },
  },
};
</script>

<style scoped lang="scss">
.gameContainer {
  display: flex;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

#btnContainer {
  height: 100%;
  margin: 10px;
}

.controlBtn {
  height: 30%;
  aspect-ratio: 1/1;
  margin: 5%;
  border: 5px solid black;
  border-radius: 15px;
}

.quetioncontainer {
  display: flex;
  height: 20vh;
  border: 2px solid #121212;
  border-radius: 15px;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
  align-items: center;
}

.quation__text {
  align-items: center;
  align-self: center;
}

.quation__picture {
  height: 100%;
}
</style>
