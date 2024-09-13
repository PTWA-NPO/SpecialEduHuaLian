<template>
  <v-image :config="configPassage" @click="click()"></v-image>
  <v-text :config="configOption"></v-text>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
const passageImg = document.createElement("img");
passageImg.src = GamesGetAssetsFile("MA_Pub_12", "Passage.png");//需要改成變數

export default {
  data() {
    return {
      configPassage: {
        x: 0,
        y: 0,
        width: 2225,
        height: 225,
        image: passageImg,
      },

      configOption: {
        x: 1000,
        y: 0,
        //height: 10,
        //width: 10,
        text: ":0",
        stroke: "black",
        fontSize: 50,
        visible: true,
      },

      //speed: 1,
    };
  },

  props: ["Y", "w", "l", "option", "speed"],

  mounted() {
    this.configPassage.y = this.Y;
    this.configOption.y = this.Y + Math.floor(this.l * 0.04);
    this.configOption.fontSize = Math.floor(this.l * 0.05);
    this.configOption.text = this.option;
    //console.log(this.option);
    this.configPassage.height = this.w;
    this.configPassage.width = Math.floor(this.l * 2.225);
    this.Update = window.setInterval(this.update, 20);
    //addEventListener("keydown", this.speedup);
  },

  methods: {
    update() {
      //console.log(document.getElementById("M3029").clientWidth);
      this.configPassage.x -= this.speed;
      this.configOption.x = this.configPassage.x + Math.floor(this.l * 1.05);
      if (this.configPassage.x <= -Math.floor(this.l * 1.2)) {
        this.$emit("end");
        this.configPassage.x = 0;
        //this.speed = 1;
        clearInterval(this.Update);
        setTimeout(this.replay, 1000);
      }
    },
    speedup(e) {
      if (e.keyCode == 32) {
        this.speed = 10;
      }
    },

    replay() {
      this.Update = window.setInterval(this.update, 20);
    },

    click() {
      this.$emit("OnClick", this.Y);
    },
  },
};
</script>
