<template>
<div class="Outter">
    <div class="TopContainer" v-if="GameData.TopContainer != undefined">
        <component :is="GameData.TopContainer.Name" :Data="GameData.TopContainer.Data" :ID="this.id"></component>
    </div>
    <div class="Container" :class="{ 'single-column': GameData.SlotComponent == undefined }">
        <div class="ComponentArea Rect" v-if="GameData.SlotComponent != undefined">
            <component :ID="this.id" :is="GameData.SlotComponent.Name" :Data="GameData.SlotComponent.Data"></component>
        </div>
        <div class="Questions Rect">
            <div v-for="(Question, index) in GameData.Questions" class="Question">
                <div v-for="(item,partIndex) in splitQuestion(Question.Question)" class="part-container">
                    <p v-if="!isPlaceHolder(item)">{{item}}</p>
                    <div v-else v-for="(Selection, item) in Question.Selection" @click="SelectItem(index,item)"  class="select-component" :class="{'selected-component': this.SelectionRecord[index] == item}">
                        <component :ID="this.id" :is="this.GameData.SelectionType" :Data="Selection"></component>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button @click="CheckAnswer" class="SubmitAnswer">送出答案</button>
</div>
</template>

<script>
import { getComponents } from '@/utilitys/get_components';

export default {
    name: 'SelectGameMulti',
    components: {
        TextOnly: getComponents('TextOnly'),
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
    data() {
        return {
            id: "0123",
            SelectionRecord: []
        }
    },
    created(){
        for(var i in this.GameData.Questions){
            this.SelectionRecord.push(null);
        }
    },
    mounted(){
        let Container = document.getElementsByClassName('Container')[0];
        console.log(Container);
        if (this.GameData.SlotComponent == undefined) {
            Container.style.gridTemplateColumns = '1fr';
        }
    },
    methods:{
        SelectItem(index,selection){
            this.SelectionRecord[index] = selection;
        },
        CheckAnswer(){
            let isCorrect = true;
            let Answers = []
            for(var i in this.GameData.Questions){
                Answers.push(this.GameData.Questions[i].Answer)
                if(this.SelectionRecord[i] != this.GameData.Questions[i].Answer){
                    isCorrect = false;
                }
            }
            if(isCorrect){
                this.$emit('play-effect', 'CorrectSound')
                this.$emit('add-record',[Answers, this.SelectionRecord,"正確"])
                this.$emit('next-question');
            }else{
                this.$emit('play-effect', 'WrongSound',)

                this.$emit('add-record',[ Answers, this.SelectionRecord,"錯誤"])
            }
        },
        splitQuestion(question) {
            return question.split(/(\$question\$)/g);
        },
        isPlaceHolder(part) {
            return part === '$question$';
        }
    }
}
</script>
<style scoped>
.Outter{
    margin: 1rem;
    display: flex;
    flex-direction: column;
    .SubmitAnswer {
        width: 10rem;
        height: 4rem;
        border-radius: 15px;
        background-color: #FFBE0B;
        scale: 1;
        transition: 0.5s;
        font-size: 1.5rem;
        align-self: flex-end;
        margin: 1rem;
    }
    .TopContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem;
    }
}
.Container {
    display: grid;
    grid-template-columns: 3fr 7fr;    
    .Rect{
        border: solid 1px;
        margin: 0 1rem;
        border-radius: 15px;
    }
}
.Container .single-column {
    grid-template-columns: 1fr;
}

.Questions {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    .Question {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.5rem 0;
        border-radius: 15px;
        border: solid 3px #aaa;
        p {
            text-align: center;
            font-size: x-large;
            margin: 0.5rem;
            padding: 0.5rem;
            border-radius: 15px;
        }
        .part-container{
            display: flex;
            flex-direction: row;
            align-items: center;
            .select-component {
                border: none;
                margin: 0.5rem;
                border-radius: 15px;
                padding: 0.5rem;
                cursor: pointer;
                scale: 1;
                transition: 0.3s;
            }
            .select-component:hover {
                scale: 1.07;
                transition: 0.3s;
            }
            .selected-component {
                border: solid 3px blue;
                scale: 1.07;
            }
        }
    }
}
</style>