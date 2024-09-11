<template>
<div class="word">
    <p ref="font">{{ this.Data.Text }}</p>
</div>
</template>
<script>
export default {
    name: 'TextOnly',
    props: {
        Data : {
            type: Object,
            required: true
        },
        ID: {
            type: String,
            required: true
        }
    },
    data() {
        return {

        };
    },
    mounted() {
        if (this.Data.Size != undefined) {
            switch (this.Data.Size) {
                case 'Tiny':
                    this.$refs.font.style.fontSize = '1rem';
                    break;  
                case 'Small':
                    this.$refs.font.style.fontSize = '1.5rem';
                    break;
                case 'Medium':
                    this.$refs.font.style.fontSize = '2rem';
                    break;
                case 'Large':
                    this.$refs.font.style.fontSize = '3rem';
                    break;
            }
        }
        if (this.Data.Zhuyin == true) {
            this.$refs.font.style.fontFamily = 'YuanQuan';
        }
    }
}
</script>
<style scoped>
/* Your component's CSS styles go here */
div{
    width: 100%;
    height: 100%;
    /* border: solid 1px black; */
    display: table;
    p{
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        font-size: 2rem;
    }
}
</style>