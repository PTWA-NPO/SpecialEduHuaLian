import{G as m}from"./get_assets-8814068a.js";import{_ as u,o as c,c as l,a as i,t as h,F as _,j as f}from"./index-fce9030c.js";const x={name:"AutoNumberingGame",data(){return{picture_total:0,QuestionRange:[],picture_type:".png",targetWidth:100,targetHeight:100,minDistance:100,positions:[],exist_image:0,wrong_time:0,level:0,canvas:null,context:null,error_text:null,errorMsg:"",btn:[]}},props:{GameData:{type:Object,required:!0},GameConfig:{type:Object,required:!0},id:{type:String,required:!0}},created(){this.QuestionRange=this.GameData.Question.Range;for(var t in this.GameData.Question.ObjImgList)this.picture_total+=1;for(var t=this.GameData.Question.Range[0];t<=this.GameData.Question.Range[1];t++)this.btn.push(t)},mounted(){let t=document.getElementById("MainContainer").getBoundingClientRect();this.canvas=this.$refs.canvas,this.context=this.canvas.getContext("2d"),this.canvas.width=t.width*.7,this.canvas.height=t.height*.7,this.error_text=document.getElementById("error_msg");var e=!0;e===!0&&(this.clearCanvas(),this.randomPicturePosition(),e=!1)},methods:{getRandPicture(){const t=Math.floor(Math.random()*this.GameData.Question.ObjImgList.length)+0;var e="S_"+this.GameData.Question.ObjImgList[t]+this.picture_type,s=m(this.id,e);return console.log(s),s},randomPicturePosition(){var t=Math.floor(Math.random()*(this.GameData.Question.Range[1]-this.GameData.Question.Range[0]))+this.GameData.Question.Range[0];const e=new Image;this.exist_image=0,e.src=this.getRandPicture(),this.positions=[],e.addEventListener("load",()=>{for(let s=0;s<t;s++){const o=Math.random()*(this.canvas.width-this.targetWidth),a=Math.random()*(this.canvas.height-this.targetHeight);let r=!1;for(const n in this.positions){const d=this.positions[n][0],g=this.positions[n][1];if(Math.sqrt((o-d)**2+(a-g)**2)<this.minDistance){r=!0;break}}if(r)t+=1;else{this.context.drawImage(e,o,a,this.targetWidth,this.targetHeight);const n=[o,a];this.positions.push(n),this.exist_image+=1}}console.log(this.positions)})},drawCircleWithText(t,e,s){this.context.beginPath(),this.context.arc(t,e,50,0,2*Math.PI),this.context.strokeStyle="black",this.context.lineWidth=1,this.context.stroke(),this.context.fillStyle="black",this.context.font="20px Arial",this.context.textAlign="center",this.context.fillText(s,t,e+70)},judgeAnswer(t){console.log(t),t===this.exist_image?(console.log("Correct"),this.$emit("play-effect","CorrectSound"),this.$emit("add-record",[this.exist_image,t,"正確"]),this.newGame()):this.wrong_time>=3?(this.errorMsg="請根據提示回答答案",this.drawClue()):(t=3-this.wrong_time,this.errorMsg=`錯誤，請再試一次，剩餘${t}次機會`,this.$emit("play-effect","WrongSound"),this.$emit("add-record",[this.exist_image,t,"錯誤"]),this.wrong_time+=1)},clearCanvas(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height)},drawClue(){let t=1;for(const e in this.positions)this.drawCircleWithText(this.positions[e][0]+50,this.positions[e][1]+50,t.toString()),t++},win(){this.$emit("play-effect","HarrySound"),this.$emit("next-question")},newGame(){this.level+=1,this.level==this.GameData.Question.Level?this.win():(this.errorMsg="",this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this.context.font="24px Arial",this.context.fillStyle="black",this.context.fillText("答對了",this.canvas.width/2-50,this.canvas.height/2),setTimeout(this.clearCanvas,1500),setTimeout(this.randomPicturePosition,1500))}}},p=i("br",null,null,-1),v=i("br",null,null,-1),w={class:"container"},b={class:"d-flex justify-content-between flex-row",id:"MainContainer",style:{border:"solid"}},y={class:"canvascontainer",style:{border:"solid"}},G={ref:"canvas",width:"700",height:"400"},C={class:"optionbar d-flex flex-column justify-content-center align-self-center",style:{width:"100%"}},D={class:"h3"},M={class:"h5"},Q={id:"error_msg"},R={class:"d-flex flex-column justify-content-center align-self-center d-gap gap-2 p-3",style:{width:"100%"}},j=["onClick"];function k(t,e,s,o,a,r){return c(),l("div",null,[p,v,i("div",w,[i("div",b,[i("div",y,[i("canvas",G,null,512)]),i("div",C,[i("p",D,h(this.GameData.Question.Text),1),i("p",M,h(this.GameConfig.OptionBarText),1),i("div",Q,h(a.errorMsg),1),i("div",R,[(c(!0),l(_,null,f(a.btn,(n,d)=>(c(),l("button",{class:"btn btn-primary",onClick:g=>r.judgeAnswer(n)},h(n),9,j))),256))])])])])])}const I=u(x,[["render",k]]);export{I as default};
