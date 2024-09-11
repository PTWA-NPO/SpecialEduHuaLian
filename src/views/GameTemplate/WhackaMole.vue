<template>
  <div class="gameContainer">
    <h2>{{ GameData.Question }}</h2>
    <v-stage :config="configKonva">
      <v-layer>
        <v-rect :config="configBg"></v-rect>
      </v-layer>
      <v-layer>
        <mole
          v-for="i in map"
          :X="i[1]"
          :Y="i[2]"
          :width="configKonva.width"
          :moleId="i[0]"
          :option="i[3]"
          @showSign="giveOption"
          @whacked="answer"
        ></mole>
      </v-layer>
      <v-layer>
        <hole
          v-for="i in map"
          :X="i[1]"
          :Y="i[2]"
          :width="configKonva.width"
        ></hole>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    hole: defineAsyncComponent(() => import("@/components/moleHole.vue")),
    mole: defineAsyncComponent(() => import("@/components/mole.vue")),
  },
  data() {
    return {
      configKonva: {
        width: 1000,
        height: 500,
      },

      configBg: {
        x: 0,
        y: 0,
        width: 1000,
        height: 500,
        fill: "darkgray",
        stroke: "darkgray",
      },

      map: [
        [0, 375, 150, ""],
        [1, 625, 150, ""],
        [2, 250, 350, ""],
        [3, 500, 350, ""],
        [4, 750, 350, ""],
      ],
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
  },
  beforeMount() {
    var gameWidth = document.getElementById("GameContainer").clientWidth;
    this.configKonva.width = Math.floor(gameWidth * 0.8);
    for (var i = 0; i < 5; ++i) {
      this.map[i][1] = Math.floor(
        (this.configKonva.width * this.map[i][1]) / 1000
      );
      this.map[i][2] = Math.floor(
        (this.configKonva.width * this.map[i][2]) / 1000
      );
    }
  },

  mounted() {
    this.configKonva.height = Math.floor(this.configKonva.width / 2);
    this.configBg.width = this.configKonva.width;
    this.configBg.height = this.configKonva.height;
    this.true = this.GameData.True;
    this.false = this.GameData.False;
    this.ansLeft = this.true.length;
  },

  methods: {
    giveOption(id) {
      this.map[id][3] = this.randomOption();
      //console.log(this.randomOption());
    },

    randomOption() {
      var trueOptions = this.true.length;
      var falseOptions = this.false.length;
      var optionId = Math.floor(Math.random() * (trueOptions + falseOptions));
      if (optionId < trueOptions) {
        return this.true[optionId];
      } else {
        return this.false[optionId - trueOptions];
      }
    },

    answer(option) {
      var ans = false;
      for (let i in this.GameData.True) {
        if (option == this.GameData.True[i]) {
          this.true = this.true.filter(
            (option) => option != this.GameData.True[i]
          );
          ans = true;
          break;
        }
      }
      if (ans) {
        this.$emit("play-effect", "CorrectSound");
        this.ansLeft--;
        if (this.ansLeft <= 0) this.$emit("next-question");
      } else this.$emit("play-effect", "WrongSound");
    },
  },
};
</script>

<style scoped lang="scss">
.gameContainer {
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>
