<template>
    <div class="Outter" ref="Outter">
        <canvas id="cup" ref="Cup"></canvas>
    </div>
</template>

<script>
import { GetSlotComponentData } from '../utilitys/get_assets';

export default {
    name: 'Water',
    data() {
        return {
            CupData: [],
        };
    },
    props: {
        Data: {
            type: Object,
            required: true
        }
    },
    methods: {
        ContDrawInfo(Scale, ML, dpr) {
            let StartX = 0;
            let StartY = 0;
            let EndX = 0;
            let EndY = 0;
            let canvas = document.getElementById('cup');
            let ctx = canvas.getContext('2d');
            if (Scale == 1000) {
                StartX = (canvas.width / 15) * 2;
                EndX = (canvas.width / 15) * 11 + 2;
                StartY = (canvas.height / 12) * ((10 - (ML / 100)) + 1);
                EndY = ((canvas.height / 12)) * (ML / 100) + 2;
            } else if (Scale == 250) {
                StartX = (canvas.width / 15) * 2;
                EndX = (canvas.width / 15) * 11 + 2;
                StartY = (canvas.height / 15) * (1 + ((13 / 250) * (250 - ML)));
                EndY = ((canvas.height / 15)) * ((13 / 250) * ML)
            } else if (Scale == 2000) {
                StartX = (canvas.width / 15) * 2;
                EndX = (canvas.width / 15) * 11 + 2;
                StartY = (canvas.height / 12) * ((10 - (ML / 200)) + 1);
                EndY = ((canvas.height / 12)) * (ML / 200) + 2;
            }
            // Adjust for DPR
            return [StartX / dpr, StartY / dpr, EndX / dpr, EndY / dpr];
        }
    },
    mounted() {
        let Outter = this.$refs.Outter;
        let canvas = this.$refs.Cup;
        let border = Math.min(Outter.clientWidth, Outter.clientHeight) - 10;

        // Get device pixel ratio
        let dpr = window.devicePixelRatio || 1;
        canvas.width = border * dpr;
        canvas.height = border * dpr;
        canvas.style.width = `${border}px`;
        canvas.style.height = `${border}px`;

        if (this.Data.Scale != 1000 && this.Data.Scale != 250 && this.Data.Scale != 2000) {
            console.warn(`SlotComponent(Water): this.Data.Scale must be 1000, 250 or 2000, not ${this.Data.Scale}, set to 2000 by default`);
            this.Data.Scale = 2000;
        }

        let ctx = canvas.getContext('2d');
        // Scale the context to account for DPR
        ctx.scale(dpr, dpr);

        // Draw Cup
        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width / dpr, canvas.height / dpr);
        }
        img.src = GetSlotComponentData("Water", `${this.Data.Scale}.png`);

        // Draw Water Rect
        let [StartX, StartY, EndX, EndY] = this.ContDrawInfo(this.Data.Scale, this.Data.Ml, dpr);
        ctx.beginPath();
        ctx.rect(StartX, StartY, EndX, EndY);
        ctx.fillStyle = '#bde0fe';
        ctx.fill();
    }
};
</script>

<style scoped>
.Outter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>
