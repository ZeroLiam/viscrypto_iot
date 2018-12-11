<template>
  <div class="home-app page-wrap">
    <img alt="Visual Cryptography mockup logo" src="~@/assets/logo.png" class="home-app__logo">
    <h2 class="home-app__heading-3">Hi there! Upload your image</h2>
    <h3 class="home-app__heading-2">Select an image from your device and upload it to our Raspberry Pi</h3>

    <DropFile />

  </div>
</template>

<script>
// @ is an alias to /src
import DropFile from './components/DropFile.vue';

export default {
  components: {
    DropFile
  },
}
</script>

<style lang="scss">
  @import '@/scss/main.scss';
  
.home-app {

    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    justify-items: center;
    
  &__logo {
    max-width: rem(190);
    margin: 0 auto;

    @include breakpoint(tablet) {
      max-width: rem(250);
    }
    @include breakpoint(desktop) {
      max-width: rem(360);
    }
  }
}
</style>