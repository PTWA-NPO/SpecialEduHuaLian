<template>
    <div class="Container">
      <p class="h1">{{ GameData.Question.text }}</p>
      <div class="Index" ref="Index">
        <div class="Konva-container" ref="KonvaContainer">
          <v-stage
            :config="configStage"
            class="Stage"
            @mousemove="MouseMove"
            @touchmove="MouseMove"
            @mouseup="MouseUpAtDot"
            @touchend="MouseUpAtDot"
          >
            <v-layer>
              <v-circle
                @mousedown="
                  (event) => {
                    MouseDown(event, index);
                  }
                "
                @touchstart="
                  (event) => {
                    MouseDown(event, index);
                  }
                "
                v-for="(Object, index) in DotLocation"
                :key="index"
                :config="{ x: Object.X, y: Object.Y, radius: 10, fill: 'black' }"
              ></v-circle>
            </v-layer>
            <v-layer ref="LineLayer">
              <v-line v-for="Line in Lines" :config="Line"></v-line>
            </v-layer>
            <v-layer ref="OnDrawLineLayer">
              <v-line :config="OnDrawingLine"></v-line>
            </v-layer>
          </v-stage>
        </div>
        <div
          class="ObjectContainer"
          ref="ObjectContainer"
          v-for="(Object, index) in ComponentConfig"
          :style="{
            position: 'absolute',
            top: Object.Y + 'px',
            left: Object.X + 'px',
            width: this.ComponentPositionConfig.ObjectWidth + 'px',
            height: this.ComponentPositionConfig.ObjectHeight + 'px',
          }"
        >
          <component
            :is="Object.Name"
            :Data="Object.Data"
            :ID="this.id"
            class="Component"
            :key="ComponentConfig"
          ></component>
        </div>
      </div>
      <div class="Buttons">
        <h3 v-if="NotFinished">請連完所有的線段</h3>
        <button
          @click="CheckAll"
          v-if="this.GameConfig.CheckingMode == 'OnSubmit'"
        >
          檢查答案
        </button>
        <button
          @click="ClearAllLine"
          v-if="this.GameConfig.CheckingMode == 'OnSubmit'"
        >
          清除所有的線
        </button>
        <!-- <button
          @click="PopLastLine"
          v-if="this.GameConfig.CheckingMode == 'OnSubmit'"
        >
          刪除最後一條線
        </button> -->
      </div>
    </div>
  </template>
  
  <script>
  // import { Stage, Layer, Circle, Line } from 'vue-konva';
  import { defineAsyncComponent } from "vue";
  export default {
    name: "LinkGameV2",
    components: {
      // 'v-stage': Stage,
      // 'v-layer': Layer,
      // 'v-circle': Circle,
      // 'v-line': Line,
      ImageContainer: defineAsyncComponent(() =>
        import("@/components/ImageContainer.vue")
      ),
      TextOnly: defineAsyncComponent(() =>
        import("@/components/TextOnly.vue")
      ),
      NumberBoard: defineAsyncComponent(() =>
        import("@/components/NumberBoard.vue")
      )
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      GameData: {
        type: Object,
        required: true,
      },
      GameConfig: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        // id: "MA4008",
        // GameData: {
        //     "Question": {
        //         "text": "把一樣的數連起來",
        //         "RowData": [
        //             [
        //                 { Name: 'ImageContainer', Data: { Src: '1261.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: '1324.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: '1456.png' } }
        //             ],
        //             [
        //                 { Name: 'ImageContainer', Data: { Src: 'c-1456.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: 'c-1324.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: 'c-1261.png' } }
        //             ],
        //             [
        //                 { Name: 'ImageContainer', Data: { Src: 'n-1324.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: 'n-1261.png' } },
        //                 { Name: 'ImageContainer', Data: { Src: 'n-1456.png' } }
        //             ]
        //         ]
        //     },
        //     "Answer": [
        //         [[0,0],[1,2]],
        //         [[0,1],[1,1]],
        //         [[0,2],[1,0]],
        //         [[0,3],[1,4]],
        //         [[0,4],[1,3]],
        //         [[2,0],[3,2]],
        //         [[2,1],[3,0]],
        //         [[2,2],[3,1]],
        //         [[2,3],[3,4]],
        //         [[2,4],[3,3]]
        //     ]
        // },
        configStage: {
          width: 610,
          height: 100,
        },
        ComponentConfig: [],
        ComponentPositionConfig: {},
        DotLocation: [],
        LineWidth: 4,
        IndexInfo: null,
        MiniGap: 20,
        Lines: [],
        LinkedPoints: [],
        OnDrawingLine: {
          points: [],
          stroke: "black",
          strokeWidth: 2,
          lineCap: "round",
          lineJoin: "round",
        },
        OnDrawing: false,
        IndexMappingTable: [],
        MouseDownDotIndex: null,
        NotFinished: false,
      };
    },
    mounted() {
      this.IndexInfo = this.$refs.Index.getBoundingClientRect();
      this.Init();
      window.addEventListener("resize", this.Init);
      window.addEventListener("resize", this.ReLinktheLine);
    },
    created() {
      if (this.GameConfig.CheckingMode == undefined) {
        this.GameConfig.CheckingMode = "OnSubmit";
      }
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.Init);
      window.removeEventListener("resize", this.ReLinktheLine);
    },
    methods: {
      MouseDown(e, index) {
        // e is the event object, index is the index of the dot
        let Lined = this.CheckLined(index); // 確認該點是否已經連線，有則刪除
        if (Lined[0]) {
          this.Lines.splice(Lined[1], 1);
          this.LinkedPoints.splice(Lined[1], 1);
          this.$refs.LineLayer.getNode().draw();
        }
        this.NotFinished = false;
        const MousePos = e.target.getStage().getPointerPosition();
        this.OnDrawing = true;
        this.MouseDownDotIndex = index;
        this.OnDrawingLine = {
          points: [MousePos.x, MousePos.y, MousePos.x, MousePos.y],
          stroke: "black",
          strokeWidth: this.LineWidth,
          lineCap: "round",
          lineJoin: "round",
        };
      },
      MouseMove(e) {
        if (this.OnDrawing) {
          // 不斷更新線段的終點位置
          const MousePos = e.target.getStage().getPointerPosition();
          this.OnDrawingLine.points.splice(2, 2, MousePos.x, MousePos.y);
          this.$refs.OnDrawLineLayer.getNode().draw();
        }
      },
      MouseUpAtDot(e) {
        if (this.OnDrawing) {
          const MousePos = e.target.getStage().getPointerPosition();
          this.OnDrawingLine.points.splice(2, 2, MousePos.x, MousePos.y);
          let DotIndex = this.CheckMouseAtTheDot(MousePos.x, MousePos.y);
          if (DotIndex != false) {
            let LinkAble = this.CheckLinkAble(this.MouseDownDotIndex, DotIndex);
            // UP OK
            if (LinkAble) {
              let AnswerCorrect = null;
              if (this.GameConfig.CheckingMode == "OnAnswered") {
                AnswerCorrect = this.CheckAnswerisCorrect(
                  this.MouseDownDotIndex,
                  DotIndex
                );
              } else {
                AnswerCorrect = true;
              }
              if (AnswerCorrect) {
                this.OnDrawingLine.points.splice(
                  2,
                  2,
                  this.DotLocation[DotIndex].X,
                  this.DotLocation[DotIndex].Y
                );
                this.Lines.push({ ...this.OnDrawingLine }); // Spread operator to create a new object
                this.OnDrawing = false;
                this.OnDrawingLine = {
                  points: [],
                  stroke: "black",
                  strokeWidth: 2,
                  lineCap: "round",
                  lineJoin: "round",
                }; // Reset OnDrawingLine
                this.$refs.LineLayer.getNode().draw();
                this.$refs.OnDrawLineLayer.getNode().draw();
                this.LinkedPoints.push([this.MouseDownDotIndex, DotIndex]);
                if (this.GameConfig.CheckingMode == "OnAnswered") {
                  this.CheckAllAnswered();
                }
                return;
              }
            }
          }
          this.OnDrawing = false;
          this.OnDrawingLine = {
            points: [],
            stroke: "black",
            strokeWidth: 2,
            lineCap: "round",
            lineJoin: "round",
          }; // Reset OnDrawingLine
          this.$refs.OnDrawLineLayer.getNode().draw();
        }
      },
      CheckMouseAtTheDot(mouseX, mouseY) {
        for (var DotIndex in this.DotLocation) {
          let Dot = this.DotLocation[DotIndex];
          let differenceRadius = 15;
          if (
            mouseX > Dot.X - differenceRadius &&
            mouseX < Dot.X + differenceRadius &&
            mouseY > Dot.Y - differenceRadius &&
            mouseY < Dot.Y + differenceRadius
          ) {
            return parseInt(DotIndex);
          }
        }
        return false;
      },
      MappingDotIndexToAnswerIndex(DotIndex) {
        // This Program give each dot a index, from top to down, left to right, start from 0 to n
        // The Teacher's Answer is a 2D array, each element is a pair of index, the first element is the index of the first dot, the second element is the index of the second dot
        // This function will convert the dot index to the answer index
        return this.IndexMappingTable[DotIndex];
      },
      CheckLinkAble(StartIndex, EndIndex) {
        let StartColumn = this.MappingDotIndexToAnswerIndex(StartIndex)[0];
        let EndColumn = this.MappingDotIndexToAnswerIndex(EndIndex)[0];
        if (StartColumn == EndColumn) {
          return false;
        } else if (StartColumn % 2 == 0 && EndColumn == StartColumn + 1) {
          return true;
        } else if (StartColumn % 2 == 1 && EndColumn == StartColumn - 1) {
          return true;
        } else {
          return false;
        }
      },
      CheckAnswerisCorrect(StartIndex, EndIndex) {
        let Answer = this.GameData.Answer;
        let Start = this.MappingDotIndexToAnswerIndex(StartIndex);
        let End = this.MappingDotIndexToAnswerIndex(EndIndex);
        console.log(Start, End);
        for (var AnswerIndex in Answer) {
          if (
            Answer[AnswerIndex][0][0] == Start[0] &&
            Answer[AnswerIndex][0][1] == Start[1] &&
            Answer[AnswerIndex][1][0] == End[0] &&
            Answer[AnswerIndex][1][1] == End[1]
          ) {
            if (this.GameConfig.CheckingMode == "OnSubmit") {
              return true;
            }
            this.$emit("play-effect", "CorrectSound");
            this.$emit("add-record", [
              this.GameData.Answer,
              [Start, End],
              "正確",
            ]);
            return true;
          }
          //Reverse Check
          else if (
            Answer[AnswerIndex][0][0] == End[0] &&
            Answer[AnswerIndex][0][1] == End[1] &&
            Answer[AnswerIndex][1][0] == Start[0] &&
            Answer[AnswerIndex][1][1] == Start[1]
          ) {
            if (this.GameConfig.CheckingMode == "OnSubmit") {
              return true;
            }
            this.$emit("play-effect", "CorrectSound");
            this.$emit("add-record", [
              this.GameData.Answer,
              [Start, End],
              "正確",
            ]);
            return true;
          }
        }
        if (this.GameConfig.CheckingMode == "OnSubmit") {
          return false;
        }
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", [this.GameData.Answer, [Start, End], "錯誤"]);
        return false;
      },
      MarkWrongLine(lineIndex) {
        this.Lines[lineIndex].stroke = "red";
        this.$refs.LineLayer.getNode().draw();
      },
      ClearAllLine() {
        this.Lines = [];
        this.LinkedPoints = [];
        this.$refs.LineLayer.getNode().draw();
      },
      PopLastLine() {
        this.Lines.pop();
        this.LinkedPoints.pop();
        this.$refs.LineLayer.getNode().draw();
      },
      CheckAllAnswered() {
        if (this.LinkedPoints.length == this.GameData.Answer.length) {
          this.$emit("next-question");
        }
      },
      CheckAll() {
        let CorrectItem = 0;
        if (this.LinkedPoints.length != this.GameData.Answer.length) {
          this.$emit("play-effect", "WrongSound");
          this.NotFinished = true;
          return;
        }
        for (var i in this.LinkedPoints) {
          let Start = this.LinkedPoints[i][0];
          let End = this.LinkedPoints[i][1];
          let Answer = this.GameData.Answer[i];
          let re = this.CheckAnswerisCorrect(Start, End);
          if (re) {
            CorrectItem += 1;
          } else {
            this.MarkWrongLine(i);
          }
        }
        if (CorrectItem == this.GameData.Answer.length) {
          this.$emit("play-effect", "CorrectSound");
          this.$emit("add-record", [
            this.GameData.Answer,
            this.LinkedPoints,
            "正確",
          ]);
          this.$emit("next-question");
        } else {
          this.$emit("play-effect", "WrongSound");
          this.$emit("add-record", [
            this.GameData.Answer,
            this.LinkedPoints,
            "錯誤",
          ]);
        }
      },
      CheckLined(index) {
        for (var LinkedPoint in this.LinkedPoints) {
          if (
            this.LinkedPoints[LinkedPoint][0] == index ||
            this.LinkedPoints[LinkedPoint][1] == index
          ) {
            return [true, LinkedPoint];
          }
        }
        return [false];
      },
      ReLinktheLine() {
        this.Lines = [];
        for (var LinkedPoint in this.LinkedPoints) {
          let Start = this.LinkedPoints[LinkedPoint][0];
          let End = this.LinkedPoints[LinkedPoint][1];
          this.OnDrawingLine.points = [
            this.DotLocation[Start].X,
            this.DotLocation[Start].Y,
            this.DotLocation[End].X,
            this.DotLocation[End].Y,
          ];
          this.Lines.push({ ...this.OnDrawingLine });
        }
      },
      Init() {
        // Sync Canvas Position
        let KonvaContainer = this.$refs.KonvaContainer;
        let KonvaBorder = KonvaContainer.getBoundingClientRect();
        this.configStage.width = KonvaBorder.width;
        this.configStage.height = KonvaBorder.height;
  
        // Setting Column Gap Width and Object Width
        let Column = this.GameData.Question.RowData.length;

        // Object Width Occupied 3/5 and Blank Width Occupied 2/5
        this.ComponentPositionConfig.ObjectWidth =
        (KonvaBorder.width / (Column * 2.5 + (Column - 1) * 2.5)) * 2.5; 
        this.ComponentPositionConfig.BlankWidth =
          (KonvaBorder.width / (Column * 2.5 + (Column - 1) * 2.5)) * 2.5;
  
        //Config each Object Position
        let NowX = 0;
        let DotColIndex = 0;
        this.DotLocation = [];
        this.IndexMappingTable = [];
        this.ComponentConfig = [];
        for (var ColumnIndex in this.GameData.Question.RowData) {
          let ColumnObjectAmount =
            this.GameData.Question.RowData[ColumnIndex].length;
          // Whe we calculate each object's heght, we add MiniGap at the top and bottom of the column
          this.ComponentPositionConfig.ObjectHeight =
            (KonvaBorder.height - this.MiniGap * (ColumnObjectAmount + 1)) /
            ColumnObjectAmount;
          let NowY = this.MiniGap;
          for (var ObjectInfo in this.GameData.Question.RowData[ColumnIndex]) {
            let Object = {};
            //General Settings
            Object.X = NowX;
            Object.Y = NowY;
            Object.Name =
              this.GameData.Question.RowData[ColumnIndex][ObjectInfo].Name;
            Object.Data =
              this.GameData.Question.RowData[ColumnIndex][ObjectInfo].Data;
  
            //Dot Settings, if not first or last column, add 2 dots at each side
            if (
              ColumnIndex != 0 &&
              ColumnIndex != this.GameData.Question.RowData.length - 1
            ) {
              this.IndexMappingTable.push([
                parseInt(DotColIndex + 1),
                parseInt(ObjectInfo),
              ]);
              this.DotLocation.push({
                X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2,
              });
              this.IndexMappingTable.push([
                parseInt(DotColIndex),
                parseInt(ObjectInfo),
              ]);
              this.DotLocation.push({
                X: NowX - this.MiniGap,
                Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2,
              });
            } else if (ColumnIndex == 0) {
              this.IndexMappingTable.push([
                parseInt(DotColIndex),
                parseInt(ObjectInfo),
              ]);
              this.DotLocation.push({
                X: NowX + this.ComponentPositionConfig.ObjectWidth + this.MiniGap,
                Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2,
              });
            } else if (ColumnIndex == this.GameData.Question.RowData.length - 1) {
              this.IndexMappingTable.push([
                parseInt(DotColIndex),
                parseInt(ObjectInfo),
              ]);
              this.DotLocation.push({
                X: NowX - this.MiniGap,
                Y: NowY + this.ComponentPositionConfig.ObjectHeight / 2,
              });
            }
            NowY += this.ComponentPositionConfig.ObjectHeight + this.MiniGap;
            this.ComponentConfig.push(Object);
          }
          NowX +=
            this.ComponentPositionConfig.ObjectWidth +
            this.ComponentPositionConfig.BlankWidth;
          if (
            ColumnIndex != 0 &&
            ColumnIndex != this.GameData.Question.RowData.length - 1
          ) {
            DotColIndex += 2;
          } else {
            DotColIndex += 1;
          }
        }
      },
    },
  };
  </script>
  <style scoped>
  /* Your component-specific styles go here */
  .Container {
    width: 100%;
    max-height: 65vh;
    display: inline-block;
    position: relative;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .Index {
    position: relative; /* 設置相對定位作為子元素的參考 */
    width: 100%;
    height: 90%;
  }
  
  .Konva-container,
  .ObjectContainer {
    position: absolute; /* 設置絕對定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .ObjectContainer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Component {
    width: 100%;
    height: 100%;
  }
  .Buttons {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    gap: 1rem;
    h3 {
      color: red;
    }
  }
  button {
    height: 3rem;
    border-radius: 15px;
    background-color: #4caf50;
    font-size: 2rem;
  }
  :deep(.NumberBoard) {
    font-size: 0.6rem !important;
}
:deep(.EachBlanket) {
  font-size: 0.8rem !important;
}
:deep(.EachRow) {
  min-height: 10px !important;
  max-height: 60px !important;
}
</style>
