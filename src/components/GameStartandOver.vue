<template>
<div class="container">
    <div v-if="Status=='NotStart'" class="Start">
        <h1>{{ GameName }}</h1>
        <div v-if="TextCheck" class="card">
            <h4 v-if="IntroType=='Html'" v-html="ShowContent"></h4>
            <h4 v-else-if="IntroType=='PlainText'">{{ShowContent}}</h4>
            <h4 v-else>無介紹文字</h4>
        </div>
        <div class="buttons">
            <button class="btn btn-primary" v-on:click="StartGame();MakeReadText('','',stop=true)">開始遊戲</button>
            <button class="btn btn-primary" v-on:click="MakeReadText(GameName,ShowContent)">朗讀</button>
            <!-- <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">教學影片</button> -->
        </div>
        
    </div>



    <div v-else-if="Status=='Done'" class="d-flex flex-column justify-content-center m-5" id="Done">
        <img src="@/assets/Effects/Firework.gif" id="Effects">
        <div class="d-flex justify-content-center d-grid gap-3 mt-3">
            <button class="btn btn-primary flex-grow-1" v-on:click="EndGame_WithoutDownload">結束遊戲</button>
            <!-- <button class="btn btn-primary flex-grow-1" v-on:click="EndGame">結束遊戲(下載紀錄)</button> -->
            <button class="btn btn-primary flex-grow-1" v-on:click="Restart">重新開始</button>
        </div>
    </div>
</div>
</template>
<script>
import * as Read from '@/utilitys/readtext.js';

export default {
    name: 'GameStartandOver',
    emits: ['start-game','download-record','restart'],
    data(){
        return {
            NameofThisComponent: 'GameStartandOver Component said:',
            TextCheck: false,
            IntroType: 'text',
            ShowContent: "",
            selectedVoice: null,
            voices: [],
        }
    },
    props: {
        GameName:{
            type: String,
        },
        intro: {
            type: Object,
        },
        Status: {
            type: String,
            required: true
        }
    },
    mounted(){
        Read.InitReadProccess();
        try{
            this.ShowContent = this.intro.Content;
            this.TextCheck = true;
            if (this.intro.Type=='Html' || this.intro.Type=='PlainText'){
                this.IntroType = this.intro.Type;
            }
        }
        catch(e){
            console.warn(this.NameofThisComponent + "No intro text found");
            // console.log(e);
        }

    },
    methods:{
        MakeReadText(Title,Description,stop=false){
            let text =  `標題:${Title}。說明:${Description}。`;
            Read.ReadText(text,stop);
        },
        StartGame(){
            this.$emit('start-game');
        },
        EndGame(){
            this.$emit('download-record');
            this.$emit('previous-page');
        },
        EndGame_WithoutDownload(){
            this.$emit('previous-page');
        },
        Restart(){
            this.$emit('restart');
        }
    }
}
</script>
<style scoped>
#Effects{
    width: auto;
    height: 50vh;
}
.container{
    height: 75vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .Start{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 1.2rem;
        max-width: 40vw;
        .card{
            width: 100%;
            padding: 1rem 1rem;
            background-color: #f0f0f0;
            h4{
                line-height: 3rem;
            }
            
        }
        .buttons{            
            width: 100%;
            display: grid;
            gap: 1rem;
            grid-auto-flow: column;
            button{
                height: 4rem;
                font-size: x-large;
                border-radius: 1rem;
            }
        }
    }
}
</style>
