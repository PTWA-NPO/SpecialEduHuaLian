<template>
  <div class="SideBar">
    <p class="Title">功能區</p>
    <div class="Buttons">
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        @click="previousQuestion()"
        v-if="GameStatus == 'Progressing'"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
              />
            </svg>
          </div>
          <div class="mx-auto">上一關</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        @click="nextQuestion()"
        v-if="GameStatus == 'Progressing'"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-down"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
              />
            </svg>
          </div>
          <div class="mx-auto">下一關</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        @click="startGame()"
        v-if="GameStatus == 'NotStart'"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-skip-start-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"
              />
            </svg>
          </div>
          <div class="mx-auto">開始</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        @click="reloadPage()"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
              />
              <path
                d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
              />
            </svg>
          </div>
          <div class="mx-auto">重新開始</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        @click="toCSV()"
        v-if="GameStatus == 'Done'"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-file-earmark-arrow-down"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"
              />
              <path
                d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"
              />
            </svg>
          </div>
          <div class="mx-auto">下載</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-patch-question-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0m1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.7 1.7 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627"
              />
            </svg>
          </div>
          <div class="mx-auto">教學</div>
        </div>
      </button>
      <button
        class="btn btn-primary text-nowrap img-hover-zoom"
        data-bs-toggle="modal"
        data-bs-target="#Calculator"
        @click="scratchSheet()"
      >
        <div class="d-flex align-items-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-calculator"
              viewBox="0 0 16 16"
            >
              <path
                d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
              />
              <path
                d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </div>
          <div class="mx-auto">計算紙</div>
        </div>
      </button>
      <slot name="hint"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "SideBar",
  props: {
    GameStatus: {
      type: String,
      default: "NotStart",
    },
    HintInfo: {
      type: Object,
      default: () => {},
    },
    Hint: {
      type: Object,
      default: () => {},
    },
    download_data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      CalculatorSwitch: false,
    };
  },
  methods: {
    previousQuestion() {
      this.$emit("previous-question");
    },
    nextQuestion() {
      this.$emit("next-question");
    },
    startGame() {
      this.$emit("start-game");
    },
    reloadPage() {
      location.reload();
    },
    toCSV(data) {
      this.$emit("to-csv", data);
    },
    provideHint() {
      this.$emit("provide-hint");
    },
    scratchSheet() {
      this.$emit("scratchSheet");
    },
  },
};
</script>
<style scoped>
.SideBar {
  border-left: solid 3px #aaa;
  background-color: #ffedda;
  height: 100%;
  width: 15%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding-top: 1rem;
  .Buttons {
    padding: 1vw;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: stretch;
    button {
      align-self: center;
      width: 90%;
      font-size: x-large;
      border-radius: 12px;
      height: 4rem;
    }
  }
  .Title {
    font-size: 2rem;
    text-align: start;
  }
  svg {
    width: 2vw;
    height: 2vw;
  }
}
</style>
