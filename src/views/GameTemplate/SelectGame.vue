<template>
    <div class="Container">
        <div class="index">
            <div class="Head">
                <p class="h2" style="font-weight: bold;">{{ this.GameConfig.GlobalTitle }}</p>
            </div>
            <div class="Info">
                <!-- 圖片的列 -->
                <div class="Component" v-if="this.GameData.SlotComponents != undefined">
                    <component class="GameImg" :is="this.SlotComponent" :ID="this.id" :Data="this.SlotData"></component>
                </div>
                <!-- 按鈕的列 -->
                <div class="selection" v-if="this.GameData.SlotComponents != undefined"> 
                    <div class="card">
                        <p class="h2">{{ this.GameData.Question_Text }}</p>
                    </div>
                    <div class="choese">
                        <button type="button" v-for="i in question" :class="{ 'Selected': this.Select[i] }" v-on:click="SelectItem(i)">{{ i }}</button>
                    </div>
                    <button type="button" class="Check" :class="{ 'OnSubmit': (this.Answer != null) }" v-on:click="CheckAnswer">送出答案</button>
                </div>
                <div class="selection2" v-else>
                    <div class="card">
                        <p class="h2">{{ this.GameData.Question_Text }}</p>
                    </div>
                    <div class="con">
                        <div class="choese">
                            <button type="button" v-for="i in question" :class="{ 'Selected': this.Select[i] }" v-on:click="SelectItem(i)">{{ i }}</button>
                            <button type="button" class="Check" :class="{ 'OnSubmit': (this.Answer != null) }" v-on:click="CheckAnswer">送出答案</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import { getComponents } from '@/utilitys/get-components.js';
export default {
    name: 'SelectGame',
    data(){
        return {
            imageUrl:'',
            question: [],
            SlotComponent: null,
            comp: null,
            Answer: null,
            Select:[]
        }
    },
    props: {
        GameData: {
            type: Object,
            required: true
        },
        GameConfig:{
            type: Object,
            required: true
        },
        id:{
            type: String,
            required: true
        }

        //Other Game Methods
    },
    methods:{
        SelectItem(index){
            for(var i in this.Select){
                this.Select[i] = false;
            }
            this.Select[index] = true;
            this.Answer = index;
        },
        CheckAnswer(){
            let answer = this.Answer;
            if(answer == this.GameData.Answer){
                this.$emit('play-effect', 'CorrectSound')
                this.$emit('add-record',[this.GameData.Answer, answer,"正確"])
                this.$emit('next-question');
                console.log('check answer : True');
            }
            else{
                this.$emit('play-effect', 'WrongSound',)
                this.$emit('add-record',[this.GameData.Answer,answer,"錯誤"])
                console.log('check answer : False');
            }
        }
    },
    created() {
        for(var i in this.GameData.Question){
            this.question.push(this.GameData.Question[i]);
            this.Select.push(false);
        }
        this.imageUrl=GamesGetAssetsFile(this.id,this.GameData.img)
        if(this.GameData.SlotComponents != undefined){
            let SlotComponentData = this.GameData.SlotComponents[0]
            this.SlotData = SlotComponentData.Data;
            this.SlotComponent = SlotComponentData.Name;
        }
        console.log(this.imageUrl);
    },
    mounted() {
        // let selection = document.getElementsByClassName('selection')[0];
        // selection.style.width = '100%';
        // selection.flexDirection = 'row';

    },
    components: {
        ImageContainer : getComponents('ImageContainer'),
    }
}
</script>
<style scoped lang="scss">
.card {
    border-style: solid;
}
.Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    max-height: 60vh !important;
    .index{
        .Head{
            padding: 1em;
            background-color: #bde0fe;
        }
        .Info{
            display: grid;
            margin-top: 2rem;
            grid-template-columns: repeat(8, 1fr);
            gap: 2rem;
            align-items: center;
            .selection{
                grid-column: 6/9;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                .card{
                    padding: 1rem;
                }
                .choese{
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    button{
                        scale: 1;
                        transition: 0.25s;
                    }
                    button:hover{
                        scale: 1.05;
                    }
                }
            }
            .selection2{
                grid-column: 2/8;
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 2rem;
                height: 100%;
                width: 100%;
                .card
                {
                    grid-column: 1/4;
                    border: solid 1px black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .con{
                    grid-column: 4/6;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .choese{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        gap: 1rem;
                        button{
                            scale: 1;
                            transition: 0.25s;
                        }
                        button:hover{
                            scale: 1.05;
                        }
                        .Check{
                            margin-top: 2rem;
                        }
                    }
                }
            }
            .Component{
                grid-column: 1/5;
                border: solid 1px black;
                height: 80%;
            }
        }
    }
    .ImgArea{
        width: 80%;
    }
}
button {
    height: 3rem;
    font-size: xx-large;
    width: 100%;
    border: solid 1px black;
    color: #000;
    border-radius: 12px;
    background-color: #FFF;
}
.OnSubmit {
    animation: blink 1s linear infinite;
}
@keyframes blink {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}
.Check{
    background-color: #bde0fe;
}
.Selected{
    background-color: #0298C0;
    scale: 1.05;
}
</style>