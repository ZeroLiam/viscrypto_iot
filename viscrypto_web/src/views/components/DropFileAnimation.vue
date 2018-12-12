<template>
    <div class="dropfile-animation">
      <span class="anim-img dropfile-animation__phone"> <img src="../../assets/phone_placeholder.png"></span>
      <span class="anim-img" :class="{'dropfile-animation__arrow': isUploading && (!hasSucceeded && !hasFailed), 'dropfile-animation__uploaded': hasSucceeded && (!isUploading && !hasFailed), 'dropfile-animation__failed': hasFailed && (!isUploading && !hasSucceeded)}"> </span>
      <span class="anim-img dropfile-animation__raspberry"> <img src="../../assets/raspi_placeholder.png"></span>
    </div>
</template>

<script>
export default {
    name: 'DropFileAnimation',
    props: {
        isUploading: Boolean,
        hasSucceeded: Boolean,
        hasFailed: Boolean
    }
}
</script>

<style lang="scss">
    @import '@/scss/main.scss';
    @keyframes transferarrow {
    from{
        opacity: 1;
        transform: translateX(0%);
    }
    to{
        opacity: 0;
        transform: translateX(100%);
    }
    }

    .dropfile-animation {
        display: flex;
        flex-flow: row nowrap;
        width: auto;
        margin: 0 auto;

        .anim-img{
        max-height: rem(60);
        }
        &__arrow {
        width: rem(150);
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
            display: inline-block;
            padding: rem(5) 0 0 0;
            height: 10px;
            width: 14px;
            transform: rotate(315deg) translateY(-3px);
        }

        animation-duration: 1.2s;
        animation-name: transferarrow;
        animation-iteration-count: infinite;
        }
    }
</style>
