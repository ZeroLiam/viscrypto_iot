<template>
    <div class="dropfile-animation" :class="this.getUploadingStatus()">
        <div class="l-animation-container">
            <span class="anim-img dropfile-animation__phone"> <img src="@/assets/smartphone.svg" height="60px"></span>
            <span class="anim-img" :class="{'dropfile-animation__arrow': 'uploading' === this.getUploadingStatus(), 'dropfile-animation__uploaded': 'uploaded' === this.getUploadingStatus(), 'dropfile-animation__failed': 'failed' === this.getUploadingStatus()}"> </span>
            <span class="anim-img dropfile-animation__raspberry"><img src="@/assets/raspberrypi.svg" height="60px"></span>
        </div>
        <p class="dropfile-animation__statusmsg">{{ this.statusMessage = this.getUploadingStatus()}}</p>
    </div>
</template>

<script>
export default {
    name: 'DropFileAnimation',
    props: {
        isUploading: Boolean,
        hasSucceeded: Boolean,
        hasFailed: Boolean
    },
    data(){
        return {
            statusMessage: ''
        }
    },
    methods: {
        getUploadingStatus(){
            if(this.isUploading && (!this.hasSucceeded && !this.hasFailed)){
                return 'uploading';
            }
            if(this.hasSucceeded && (!this.isUploading && !this.hasFailed)){
                return 'uploaded';
            }
            if(this.hasFailed && (!this.isUploading && !this.hasSucceeded)){
                return 'failed';
            }
        }
    }
}
</script>

<style lang="scss">
    @import '@/scss/main.scss';
    @keyframes goodconnection {
        from{
            background-color: $dark-light;
            transform: scaleX(0);
        }
        to{
            background-color: $success;
            transform: scaleX(1.1);
        }
    }
    @keyframes failedconnection {
        from{
            background-color: $dark-light;
            transform: scaleX(0);
        }
        to{
            background-color: $error;
            transform: scaleX(1.1);
        }
    }
    @keyframes opacityanim {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    @keyframes left2right {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(110%);
        }
    }

    .dropfile-animation {
        width: auto;
        margin: 0 auto;

        .l-animation-container {
            display: flex;
            flex-flow: row nowrap;
        }

        .anim-img{
            max-height: rem(60);
            padding: rem(4);
        }
        &__arrow {
            width: rem(100);
            margin: auto;
            padding: rem(10) 0;
            
            &:after{
                content: '';
                position: relative;
                right: calc(60px + 14px);
                top: 10px;
                align-self: center;
                border: solid $dark;
                border-width: 0 rem(4) rem(4) 0;
                border-radius: rem(4);
                border-color: $secondary;
                display: inline-block;
                padding: rem(5) 0 0 0;
                height: 10px;
                width: 14px;
                transform: rotate(315deg) translateY(-3px);
            }
            animation-duration: 1.2s;
            animation-name: left2right;
            animation-iteration-count: infinite;

        }
        &__uploaded {
            position: relative;
            left: rem(-5);
            width: rem(90);
            margin: auto;
            padding: rem(10) 0;
            background-color: $success;
            transform-origin: left;
            transform: scaleX(1.1);
            animation-duration: 1.2s;
            animation-name: goodconnection;
            animation-iteration-count: 1;
        }
        &__failed {
            position: relative;
            left: rem(-5);
            width: rem(90);
            margin: auto;
            padding: rem(10) 0;
            background-color: $error;
            transform-origin: left;
            transform: scaleX(1.1);
            animation-duration: 0.5s;
            animation-name: failedconnection;
            animation-iteration-count: 1;
        }
        &__statusmsg {
            text-transform: capitalize;

            .uploading &{
                color: $secondary;
            }
            .uploaded &{
                color: $success;
            }
            .failed &{
                color: $error;
            }
        }
    }
</style>
