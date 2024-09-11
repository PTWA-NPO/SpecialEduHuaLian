<template>
  <div class="gameContainer">
    <div id="canvasContainer">
      <h2>{{ GameData.Question }}</h2>
      <v-stage :config="configKonva">
        <v-layer>
          <v-rect :config="configBg"></v-rect>
        </v-layer>

        <v-layer>
          <safeArea
            v-for="i in safeMap"
            :x="i[0]"
            :y="i[1]"
            :width="laneWidth"
          ></safeArea>
        </v-layer>
        <v-layer>
          <bounds
            v-for="i in genMap"
            :x="i[0]"
            :y="i[1]"
            :width="laneWidth"
          ></bounds>
          <v-text :config="configOption[0]"></v-text>
          <v-text :config="configOption[1]"></v-text>
          <v-text :config="configOption[2]"></v-text>
          <v-text :config="configOption[3]"></v-text>
        </v-layer>
        <v-layer>
          <v-circle :config="configPlayer"></v-circle>
          <v-circle :config="configGhost_1"></v-circle>
          <v-circle :config="configGhost_2"></v-circle>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script>
import { GamesGetAssetsFile } from "@/utilitys/get_assets.js";
import { fasK } from "@quasar/extras/fontawesome-v6";
import { Container } from "konva/lib/Container";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    bounds: defineAsyncComponent(() => import("@/components/mazeBounds.vue")),
    safeArea: defineAsyncComponent(() =>
      import("@/components/mazeSafeArea.vue")
    ),
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
        fill: "black",
        stroke: "black",
      },

      configOption: [
        {
          stroke: "black",
        },
        {
          stroke: "black",
        },
        {
          stroke: "black",
        },
        {
          stroke: "black",
        },
      ],

      configPlayer: {
        fill: "yellow",
        stroke: "yellow",
      },
      configGhost_1: {
        fill: "red",
        stroke: "red",
      },
      configGhost_2: {
        fill: "red",
        stroke: "red",
      },

      map: [
        [
          [2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 3],
          [2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 3, 3, 3],
          [2, 2, 2, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 3, 3, 3],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
          [1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          [4, 4, 4, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 5, 5, 5],
          [4, 4, 4, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 5, 5, 5],
          [4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 5, 5, 5],
        ],
        [
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ],
      ],
      randomMapId: 0,
      genMap: [],
      safeMap: [],
      optionMap: [0, 0, 0, 0],

      entityInfo: {
        player: {
          tag: "player",
          collision: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          movement: "idle",
        },
        ghost_1: {
          tag: "ghost",
          collision: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          movement: "right",
          randomRouteCD: true,
        },
        ghost_2: {
          tag: "ghost",
          collision: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          xyGrid: {
            x: 0,
            y: 0,
          },
          movement: "left",
          randomRouteCD: true,
        },
      },
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
    this.fitCanvasInScreen();
    this.generateMap();
    this.getOptionPosition();
  },

  mounted() {
    this.bootGame();
  },

  methods: {
    fitCanvasInScreen() {
      var gameWidth = document.getElementById("GameContainer").clientWidth;
      this.configKonva.width = Math.floor(gameWidth * 0.8);
      this.configKonva.height = Math.floor(this.configKonva.width / 2);
    },
    generateMap() {
      //this.randomMapId= Math.floor( Math.random()* 3);
      this.laneWidth = Math.floor(this.configKonva.width * 0.05);
      this.configBg.width = this.laneWidth * 20 - 3;
      this.configBg.height = this.laneWidth * 10 - 3;
      this.configBg.strokeWidth = Math.floor(this.laneWidth * 0.1);
      for (var i = 0; i < 20; ++i) {
        for (var j = 0; j < 10; ++j) {
          if (this.map[this.randomMapId][j][i] == 1) {
            this.genMap.push([this.laneWidth * i, this.laneWidth * j]);
          } else if (this.map[this.randomMapId][j][i] != 0) {
            this.safeMap.push([this.laneWidth * i, this.laneWidth * j]);
          }
        }
      }
    },

    getOptionPosition() {
      for (var i = 0; i < 20; ++i) {
        for (var j = 0; j < 10; ++j) {
          switch (this.map[this.randomMapId][j][i]) {
            case 2:
              if (this.optionMap[0] == 0) this.optionMap[0] = { x: i, y: j };
              break;
            case 3:
              if (this.optionMap[1] == 0) this.optionMap[1] = { x: i, y: j };
              break;
            case 4:
              if (this.optionMap[2] == 0) this.optionMap[2] = { x: i, y: j };
              break;
            case 5:
              if (this.optionMap[3] == 0) this.optionMap[3] = { x: i, y: j };
              break;
          }
        }
      }
    },

    printOptions() {
      for (var i = 0; i < 4; ++i) {
        this.configOption[i].text = this.GameData.Options[i];
        this.configOption[i].x =
          this.optionMap[i].x * this.laneWidth +
          Math.floor(0.1 * this.laneWidth);
        this.configOption[i].y =
          this.optionMap[i].y * this.laneWidth +
          Math.floor(0.1 * this.laneWidth);
        this.configOption[i].fontSize = Math.floor(this.laneWidth * 0.8);
      }
    },

    initializeEntityPosition() {
      this.configPlayer.x = Math.floor(this.laneWidth * 9.5);
      this.configPlayer.y = Math.floor(this.laneWidth * 3.5);
      this.configGhost_1.x = Math.floor(this.laneWidth * 3.5);
      this.configGhost_1.y = Math.floor(this.laneWidth * 1.5);
      this.configGhost_2.x = Math.floor(this.laneWidth * 16.5);
      this.configGhost_2.y = Math.floor(this.laneWidth * 8.5);
    },
    initializeEntityConfig() {
      this.configPlayer.radius = Math.floor(this.laneWidth * 0.35);
      this.configGhost_1.radius = Math.floor(this.laneWidth * 0.35);
      this.configGhost_2.radius = Math.floor(this.laneWidth * 0.35);
    },
    bootGame() {
      this.printOptions();
      this.initializeEntityConfig();
      this.initializeEntityPosition();
      window.addEventListener("keydown", this.keyDown);
      window.addEventListener("keyup", this.keyUp);
      this.game = window.setInterval(this.update, 20);
    },

    keyDown(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 37:
        case 65:
          this.entityInfo.player.movement = "left";
          break;
        case 39:
        case 68:
          this.entityInfo.player.movement = "right";
          break;
        case 38:
        case 87:
          this.entityInfo.player.movement = "up";
          break;
        case 40:
        case 83:
          this.entityInfo.player.movement = "down";
          break;
      }
    },
    keyUp(e) {
      //W = 38/87; A = 37/65; S = 40/83; D = 39/68
      //console.log(e.keyCode);
      switch (e.keyCode) {
        case 37:
        case 65:
        case 39:
        case 68:
        case 38:
        case 87:
        case 40:
        case 83:
          this.entityInfo.player.movement = "idle";
          break;
      }
    },
    update() {
      this.movePlayer();
      this.moveGhost({
        config: this.configGhost_1,
        entity: this.entityInfo.ghost_1,
      });
      this.moveGhost({
        config: this.configGhost_2,
        entity: this.entityInfo.ghost_2,
      });
      this.playerInteraction();
    },

    mapInxyGrid(config) {
      return {
        x: config.x / this.laneWidth - 0.5,
        y: config.y / this.laneWidth - 0.5,
      };
    },
    checkCollision(entity) {
      entity.collision = {
        left: false,
        right: false,
        up: false,
        down: false,
      };
      var margin = 0.1;
      var roundedX = Math.round(entity.xyGrid.x);
      var roundedY = Math.round(entity.xyGrid.y);

      if (entity.xyGrid.x <= 0) entity.collision.left = true;
      else if (entity.movement == "left" && entity.xyGrid.x <= roundedX) {
        if (this.map[this.randomMapId][roundedY][roundedX - 1] == 1)
          entity.collision.left = true;
        if (
          this.map[this.randomMapId][roundedY][roundedX - 1] != 0 &&
          entity.tag == "ghost"
        )
          entity.collision.left = true;
      }

      if (entity.xyGrid.x >= 19) entity.collision.right = true;
      else if (
        entity.movement == "right" &&
        entity.xyGrid.x % 1 <= margin &&
        entity.xyGrid.x >= roundedX
      ) {
        if (this.map[this.randomMapId][roundedY][roundedX + 1] == 1)
          entity.collision.right = true;
        if (
          this.map[this.randomMapId][roundedY][roundedX + 1] != 0 &&
          entity.tag == "ghost"
        )
          entity.collision.right = true;
      }
      if (entity.xyGrid.y <= 0) entity.collision.up = true;
      else if (entity.movement == "up" && entity.xyGrid.y <= roundedY) {
        if (this.map[this.randomMapId][roundedY - 1][roundedX] == 1)
          entity.collision.up = true;
        if (
          this.map[this.randomMapId][roundedY - 1][roundedX] != 0 &&
          entity.tag == "ghost"
        )
          entity.collision.up = true;
      }
      if (entity.xyGrid.y >= 9) entity.collision.down = true;
      else if (
        entity.movement == "down" &&
        entity.xyGrid.y % 1 <= margin &&
        entity.xyGrid.y >= roundedY
      ) {
        if (this.map[this.randomMapId][roundedY + 1][roundedX] == 1)
          entity.collision.down = true;
        if (
          this.map[this.randomMapId][roundedY + 1][roundedX] != 0 &&
          entity.tag == "ghost"
        )
          entity.collision.down = true;
      }
    },

    ghostCollision(entity) {
      var possibleDirection = [];
      var roundedX = Math.round(entity.xyGrid.x);
      var roundedY = Math.round(entity.xyGrid.y);
      var cd = 300;
      switch (entity.movement) {
        case "left":
          if (roundedY > 0) {
            if (this.map[this.randomMapId][roundedY - 1][roundedX] == 0)
              possibleDirection.push("up");
          }
          if (roundedY < 9) {
            if (this.map[this.randomMapId][roundedY + 1][roundedX] == 0)
              possibleDirection.push("down");
          }

          break;
        case "right":
          if (roundedY > 0) {
            if (this.map[this.randomMapId][roundedY - 1][roundedX] == 0)
              possibleDirection.push("up");
          }
          if (roundedY < 9) {
            if (this.map[this.randomMapId][roundedY + 1][roundedX] == 0)
              possibleDirection.push("down");
          }

          break;
        case "up":
          if (roundedX > 0) {
            if (this.map[this.randomMapId][roundedY][roundedX - 1] == 0)
              possibleDirection.push("left");
          }
          if (roundedX < 19) {
            if (this.map[this.randomMapId][roundedY][roundedX + 1] == 0)
              possibleDirection.push("right");
          }

          break;
        case "down":
          if (roundedX > 0) {
            if (this.map[this.randomMapId][roundedY][roundedX - 1] == 0)
              possibleDirection.push("left");
          }
          if (roundedX < 19) {
            if (this.map[this.randomMapId][roundedY][roundedX + 1] == 0)
              possibleDirection.push("right");
          }

          break;
      }
      entity.randomRouteCD = false;
      setTimeout(() => {
        entity.randomRouteCD = true;
      }, cd);
      entity.movement =
        possibleDirection[Math.floor(Math.random(possibleDirection.length))];
    },

    ghostRandomRoute(entity) {
      var margin = 0.1;
      var cd = 300;
      var possibleDirection = [entity.movement];
      var roundedX = Math.round(entity.xyGrid.x);
      var roundedY = Math.round(entity.xyGrid.y);
      if (roundedX <= 0 || roundedX >= 19 || roundedY <= 0 || roundedY >= 9)
        return 0;
      switch (entity.movement) {
        case "left":
          if (
            entity.xyGrid.x % 1 >= 1 - margin &&
            entity.xyGrid.x <= roundedX
          ) {
            if (this.map[this.randomMapId][roundedY - 1][roundedX] == 0)
              possibleDirection.push("up");
            if (this.map[this.randomMapId][roundedY + 1][roundedX] == 0)
              possibleDirection.push("down");
          }
          break;
        case "right":
          if (entity.xyGrid.x % 1 <= margin && entity.xyGrid.x >= roundedX) {
            if (this.map[this.randomMapId][roundedY - 1][roundedX] == 0)
              possibleDirection.push("up");
            if (this.map[this.randomMapId][roundedY + 1][roundedX] == 0)
              possibleDirection.push("down");
          }
          break;
        case "up":
          if (
            entity.xyGrid.y % 1 >= 1 - margin &&
            entity.xyGrid.y <= roundedY
          ) {
            if (this.map[this.randomMapId][roundedY][roundedX - 1] == 0)
              possibleDirection.push("left");
            if (this.map[this.randomMapId][roundedY][roundedX + 1] == 0)
              possibleDirection.push("right");
          }
          break;
        case "down":
          if (entity.xyGrid.y % 1 <= margin && entity.xyGrid.y >= roundedY) {
            if (this.map[this.randomMapId][roundedY][roundedX - 1] == 0)
              possibleDirection.push("left");
            if (this.map[this.randomMapId][roundedY][roundedX + 1] == 0)
              possibleDirection.push("right");
          }
          break;
      }

      var newDirection =
        possibleDirection[Math.floor(Math.random() * possibleDirection.length)];
      if (newDirection != entity.movement) {
        entity.randomRouteCD = false;
        setTimeout(() => {
          entity.randomRouteCD = true;
        }, cd);
      }

      entity.movement = newDirection;
    },

    movePlayer() {
      this.entityInfo.player.xyGrid = this.mapInxyGrid(this.configPlayer);
      this.checkCollision(this.entityInfo.player);
      if (
        this.entityInfo.player.movement == "left" &&
        !this.entityInfo.player.collision.left
      ) {
        this.configPlayer.x -= Math.round(this.laneWidth * 0.1);
        this.configPlayer.y = Math.round(
          (Math.round(this.entityInfo.player.xyGrid.y) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "right" &&
        !this.entityInfo.player.collision.right
      ) {
        this.configPlayer.x += Math.round(this.laneWidth * 0.1);
        this.configPlayer.y = Math.round(
          (Math.round(this.entityInfo.player.xyGrid.y) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "up" &&
        !this.entityInfo.player.collision.up
      ) {
        this.configPlayer.y -= Math.round(this.laneWidth * 0.1);
        this.configPlayer.x = Math.round(
          (Math.round(this.entityInfo.player.xyGrid.x) + 0.5) * this.laneWidth
        );
      }

      if (
        this.entityInfo.player.movement == "down" &&
        !this.entityInfo.player.collision.down
      ) {
        this.configPlayer.y += Math.round(this.laneWidth * 0.1);
        this.configPlayer.x = Math.round(
          (Math.round(this.entityInfo.player.xyGrid.x) + 0.5) * this.laneWidth
        );
      }
    },
    moveGhost({ config, entity }) {
      entity.xyGrid = this.mapInxyGrid(config);
      this.checkCollision(entity);
      if (entity.collision[entity.movement]) this.ghostCollision(entity);
      else if (entity.randomRouteCD) this.ghostRandomRoute(entity);
      switch (entity.movement) {
        case "left":
          config.x -= Math.floor(this.laneWidth * 0.05);
          config.y = Math.round(
            (Math.round(entity.xyGrid.y) + 0.5) * this.laneWidth
          );
          break;
        case "right":
          config.x += Math.floor(this.laneWidth * 0.05);
          config.y = Math.round(
            (Math.round(entity.xyGrid.y) + 0.5) * this.laneWidth
          );
          break;
        case "up":
          config.y -= Math.floor(this.laneWidth * 0.05);
          config.x = Math.round(
            (Math.round(entity.xyGrid.x) + 0.5) * this.laneWidth
          );
          break;
        case "down":
          config.y += Math.floor(this.laneWidth * 0.05);
          config.x = Math.round(
            (Math.round(entity.xyGrid.x) + 0.5) * this.laneWidth
          );
          break;
      }
    },
    playerInteraction() {
      if (
        this.entitiesDistance(this.configPlayer, this.configGhost_1) <=
          this.configPlayer.radius * 2 ||
        this.entitiesDistance(this.configPlayer, this.configGhost_2) <=
          this.configPlayer.radius * 2
      ) {
        this.initializeEntityPosition();
        this.$emit("play-effect", "WrongSound");
      }
    },
    entitiesDistance(config_1, config_2) {
      return (
        ((config_1.x - config_2.x) ** 2 + (config_1.y - config_2.y) ** 2) **
        (1 / 2)
      );
    },
  },
};
</script>
