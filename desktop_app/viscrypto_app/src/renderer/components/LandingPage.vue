<template>
  <div id="wrapper" class="landingpage page-wrap">
    <img class="landingpage__logo" src="~@/assets/viscryptologo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <h2>Let's decode this message</h2>
        <PictureBox codedimg="~@/assets/viscryptologo.png" staticimg="../assets/testimg/github120_share2.png" />
        <!-- <system-information></system-information> -->
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import PictureBox from './LandingPage/PictureBox'

  export default {
    name: 'landing-page',
    components: { SystemInformation, PictureBox },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/scss/main.scss';

  .landingpage {
    &__logo{
      max-width: rem(360);
    }
  }
  

</style>
