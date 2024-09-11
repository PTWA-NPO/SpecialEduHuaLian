<template>
<div class="Container" ref="Container" :style="{ width: containerSize.width + 'px', height: containerSize.height + 'px' }">
    <div class="Up MoneyContainer" :key="containerRef">
        <img v-for="item in UpContainer" :src="item"  />
    </div>
    <div class="Middle MoneyContainer" :key="containerRef">
        <img v-for="item in MiddleContainer" :src="item" />
    </div>
    <div class="Down CoinContainer" v-for="item in DownContainer">
        <div class="PerCoin" v-for="coin in item">
            <img :src="coin" v-if="coin != ''"/>
        </div>
    </div>
</div>
</template>
<script setup>
import { GetSlotComponentData } from '../utilitys/get_assets';
import { ref, onMounted, nextTick } from 'vue';

const props = defineProps({
    Data: {
        type: Object,
        required: true
    },
    ID: {
        type: String,
        required: false
    }
});


const UpContainer = ref([]);
const MiddleContainer = ref([]);
const DownContainer = ref([]);
// const Data = ref(props.Data);
const Data = ref({
    "Thousands": 1,
    "FiveHundreds": 0,
    "Hundreds": 4,
    "Fifties": 0,
    "Tens": 2,
    "Fives": 0,
    "Ones": 4
});
const containerSize = ref(false);
const containerRef = ref(0);
const Container = ref(null);

const loadData = () => {
  if (Data.value.Thousands) {
    for (let i = 0; i < Data.value.Thousands; i++) {
      UpContainer.value.push(GetSlotComponentData('MoneyGenerator', '1000.png'));
    }
  }
  if (Data.value.FiveHundreds) {
    for (let i = 0; i < Data.value.FiveHundreds; i++) {
      UpContainer.value.push(GetSlotComponentData('MoneyGenerator', '500.png'));
    }
  }
 
  if (Data.value.Hundreds) {
    for (let i = 0; i < Data.value.Hundreds; i++) {
      MiddleContainer.value.push(GetSlotComponentData('MoneyGenerator', '100.png'));
    }
  }
  let RowIndex = 0
  let Cnt = 0
  let TempContainer = []
  if (Data.value.Fifties) {
    for (let i = 0; i < Data.value.Fifties; i++) {
        if(Cnt > 10){
            DownContainer.value.push(TempContainer);
            TempContainer = []
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '50.png'));
            Cnt = 0
        }else{
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '50.png'));
            Cnt++
        }
    }
  }
  if (Data.value.Tens) {
    for (let i = 0; i < Data.value.Tens; i++) {
        if ( Cnt > 10){
            DownContainer.value.push(TempContainer);
            TempContainer = []
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '10.png'));
            Cnt = 0
        }else{
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '10.png'));
            Cnt++
        }
    }
  }
  if (Data.value.Fives) {
    for (let i = 0; i < Data.value.Fives; i++) {
        if ( Cnt > 10){
            DownContainer.value.push(TempContainer);
            TempContainer = []
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '5.png'));
            Cnt = 0;
        }else{
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '5.png'));
            Cnt++;
        }
    }
  }
  if (Data.value.Ones) {
    for (let i = 0; i < Data.value.Ones; i++) {
        if ( Cnt > 10){
            DownContainer.value.push(TempContainer);
            TempContainer = []
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '1.png'));
            Cnt = 0;
        }else{
            TempContainer.push(GetSlotComponentData('MoneyGenerator', '1.png'));
            Cnt++;
        }
    }
  }
  if (TempContainer.length > 0){
    DownContainer.value.push(TempContainer);
    for(  let i = 0; i < 10 - TempContainer.length; i++){
        TempContainer.push("");
    }
  }
};
function updateContainerSize(){
    if (Container) {
        const { width, height } = Container.value.getBoundingClientRect();
        console.log(width, height);
        containerSize.value = { width, height };
    }
}
onMounted(() => {
    Container.value.focus();
    loadData();
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    // Use nextTick to ensure the container size is updated before initializing the image
    nextTick(() => {
        containerRef.value += 1;
    });
});
</script>
<script>
export default {
  name: 'MyComponent'
}
</script>
<style scoped lang="scss">
/* Your component styles here */
.Container {
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4,1fr);
    gap: 10px;
}
.MoneyContainer {
    display: grid;
    grid-template-columns: repeat(5,1fr);
    grid-template-rows: repeat(auto-fill,1fr);
    gap: 10px;
}
img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.CoinContainer {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-height: 70px;
    .PerCoin {
        display: flex;
        justify-content: end;
        align-items: end;
    }
}
</style>