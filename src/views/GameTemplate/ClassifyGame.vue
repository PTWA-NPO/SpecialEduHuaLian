<template>
    <div class="container">
        <div class="Header">
            <p class="h2">{{QuestionWord}}</p>
        </div>
        <div class="QuestionArea">
            <div class="Selection">
                <p class="h2">{{ this.GameData.InitBox }}</p>
                <draggable :list="this.Items" item-key="id" :sort="false" group="SelectItem" class="Draggroup">
                    <template #item="{ element }">
                        <div class="DragItem">
                            <component :is="element['Name']" :Data="element['Data']" :ID="this.id"></component>
                        </div>
                    </template>
                </draggable>
            </div>
            <div class="PutGroup"> 
                <div v-for="(items,index) in Groups" class="Group">
                    <p class="h2">{{ this.GameData.Answer[index].GroupName }}</p>
                    <draggable :list="Groups[index]" item-key="id" :sort="false" group="SelectItem" class="ItemContainer">
                        <template #item="{ element }">
                            <div class="DragItem">
                                <component :is="element['Name']" :Data="element['Data']" :ID="this.id"></component>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>
        <button type="button" class="Submit" v-on:click="CheckAnswer()">送出答案</button>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import cardwithbutton from '@/components/cardwithbutton.vue'
import { GamesGetAssetsFile } from '@/utilitys/get_assets.js';
import { defineAsyncComponent } from 'vue';
import { getComponents } from '@/utilitys/get_components';
export default {
    name: 'ClassifyGame',
    components: {
        draggable,
        cardwithbutton,
        TextOnly: getComponents('TextOnly'),
        ImageContainer: getComponents('ImageContainer'),
        Clock: getComponents('Clock'),
        Water: getComponents('Water'),
    },
    emits: ['play-effect','add-record','next-level'],
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
    },
    data() {
        return {
            QuestionWord: '',
            GroupID:0,
            Groups:[],
            Items:[],
        }
    },
    created(){
        // this.icon= icon1;
        this.QuestionWord=this.GameData.Text
        for(var i in this.GameData.Answer){
            this.Groups.push([])
        }
        this.Items = this.GameData.Question;
    },
    methods: {
        CheckAnswer(){
            // This code will walk through all the groups and check if the answer is right
            // Only when all the groups are right, the game will return true.
            var member=0;
            for(var i in this.Groups){
                if(this.Groups[i].length!=this.GameData.Answer[i]["Items"].length){
                    console.log('ClassifyGame CheckAnswer :Wrong')
                    this.$emit('play-effect', 'WrongSound',)
                    this.$emit('add-record',[this.Groups[i], this.GameData.Answer[i]["Items"],"錯誤"])
                    console.log('here')
                    return
                }
                for(var z in this.Groups[i]){
                    if(this.GameData.Answer[i]["Items"].includes(this.Groups[i][z].text)){
                        member++;
                    }
                }
                console.log(member)
                if (member!=this.GameData.Answer[i]["Items"].length){
                    console.log('ClassifyGame CheckAnswer :Wrong')
                    this.$emit('play-effect', 'WrongSound',)
                    this.$emit('add-record',[this.Groups[i], this.GameData.Answer[i]["Items"],"錯誤"])
                    console.log('there')
                    return
                }
                member=0;
                this.$emit('add-record',[this.Groups[i], this.GameData.Answer[i]["Items"],"正確"])
                this.$emit('play-effect', 'CorrectSound',)
                this.$emit('next-question')
            }
        }
    }
}
</script>
<style scoped lang="scss">
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    .Header{
        border: solid 1px #aaa;
        border-radius: 15px;
        padding: 0.5rem;
        align-self: stretch;
        margin-bottom: 1rem;
    }
    .Submit{
        border: solid 1px #aaa;
        border-radius: 15px;
        background-color: #FFF;
        align-self: flex-end;
        height: 3rem;
        width: 10rem;
        margin-top: 0.5rem;
    }
    .QuestionArea{
        display: grid;
        grid-template-columns: 2fr 7fr;
        gap: 1rem;
        width: 100%;
        height: 65vh;
        .Selection{
            border: solid 1px;
            border-radius: 15px;
            padding: 1rem;
            .Draggroup{
                height: 90%;
                padding: 1rem;
                display: grid;
                grid-template-columns: 1fr 1fr;
                border: solid 3px red;
                border-radius: 15px;
                gap: 1rem;
                .DragItem{
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                }
            }
        }
        .PutGroup{
            border: solid 1px;
            border-radius: 15px;
            display: flex;
            flex-direction: row;
            padding: 1rem;
            .Group{
                flex-grow: 1;
                margin: 0 1rem;
                padding: 0 1rem;
                .ItemContainer{
                    border: solid 3px green;
                    border-radius: 15px;
                    height: 90%;
                    .DragItem{
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        border: solid 3px blue;
                    }   
                }
            }
        }
    }
}
</style>

