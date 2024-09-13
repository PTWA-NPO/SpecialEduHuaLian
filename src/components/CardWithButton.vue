<template>
<div class="OutterContainer">
    <img :src="imageURL" class="" :alt="altText" v-if="this.imageURL != undefined && this.imageURL != ''">
    <p class="h3">{{ Text }}</p>
</div>
</template>
<script>
import ImageContainer from './ImageContainer.vue';
export default {
    name: 'CardWithButton',
    data() {
        return {
            
        };
    },
    components: {
        ImageContainer
    },
    props: {
        Text: {
            type: String,
        },
        altText: {
            type: String,
            
        },
        imageURL: {
            type: String,
        }
    },
    computed: {
        SentData() {
            return {
                Src: this.imageURL,
            }
        }  
    },
    mounted() {
    },
};
</script>

<style scoped>
.OutterContainer{
    display: grid;
    grid-template-rows: 5fr 1fr;
    width: 100%;
    height: 100%;
    img{
        width: 100%;
        height: 100%;
    }
}
</style>