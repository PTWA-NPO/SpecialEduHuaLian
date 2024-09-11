<template>
    <div class="">
      <div>
        <v-stage :config="stageConfig" @click="judgePosition" ref="layer">
          <v-layer >
            <v-image :config="imageConfig"></v-image>
            <v-circle
              v-for="(circle, index) in circles"
              :key="index"
              :config="circle"
              stroke="red"
              stroke-width="2"
            />
          </v-layer>
        </v-stage>
      </div>
      <input type="file" id="fileInput" @change="onFileChange" />
      <div>
        <input type="text" v-model="inputNumber" />
        <button @click="Start">開始計算</button>
      </div>
      <div v-if="(counter2 - 1) == parseInt(inputNumber)">
        <p style="color: red; font-size: 2rem;">紀錄完成</p>
      </div>
      <div>
        <div>
          <button
            v-for="(item, index) in btn"
            :key="index"
            :class="{ actbtn: drawed[index + 1] }"
          >
            {{ item }}
          </button>
        </div>
        <hr />
        <div>
          <p>正在紀錄</p>
          <p>請做: {{ command[counter - 1] }}</p>
          {{ drawingprototype }}
        </div>
        <hr />
        <div>
          <p>紀錄</p>
          {{ location }}
        </div>
      </div>
    </div>
  </template>
  
  <script>  
  export default {
    name: "FindTheItem",
    components: {

    },
    data() {
      return {
        location: [],
        inputNumber: "",
        btn: null,
        drawed: [],
        counter: 1,
        counter2: 1,
        command: ["物件左上角", "物件右下角"],
        prototype: {
          Name: "",
          LeftTop: [],
          RightBottom: [],
        },
        drawingprototype: {
          Name: "",
          LeftTop: [],
          RightBottom: [],
        },
        imageObj: null,
        circles: [],
        stageConfig: {
          width: 600,
          height: 400,
        },
        imageConfig: {
          image: null,
          x: 0,
          y: 0,
          width: 600,
          height: 400,
        },
      };
    },
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              this.imageConfig.image = img;
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      Start() {
        let temp = parseInt(this.inputNumber);
        this.btn = [];
        this.drawed = [];
        this.location = [];
        for (var i = 1; i <= temp; i++) {
          this.btn.push(i);
          this.drawed.push(false);
        }
      },
      judgePosition(event) {
        const pos = this.$refs.layer.getStage().getPointerPosition();
        if (this.counter === 1) {
          this.drawingprototype.LeftTop = [pos.x, pos.y];
          this.counter++;
        } else if (this.counter === 2) {
          this.drawingprototype.RightBottom = [pos.x, pos.y];
          this.circles.push({
            x: (this.drawingprototype.LeftTop[0] + this.drawingprototype.RightBottom[0]) / 2,
            y: (this.drawingprototype.LeftTop[1] + this.drawingprototype.RightBottom[1]) / 2,
            radius: 50,
          });
          this.counter = 1;
          this.counter2++;
          this.location.push(this.drawingprototype);
          this.drawingprototype = {
            Name: "",
            LeftTop: [],
            RightBottom: [],
          };
          this.drawed[this.counter2 - 1] = true;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    background-color: #cb9fcf;
  }
  .actbtn {
    background-color: rgb(108, 117, 88) !important;
  }
  </style>
  