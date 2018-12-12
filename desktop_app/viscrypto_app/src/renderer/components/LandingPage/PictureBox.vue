<template>
    <div class="picturebox">
        <div class="l-picturebox-container">
            <div class="picturebox__image static">
                <!-- <img src="~@/assets/testimg/github120_share2.png" /> -->
                <img src="~@/assets/testimg/github120_share2.png" />
            </div>
            <div class="picturebox__image coded dragme">
                <img src="~@/assets/testimg/github120_share1.png" />
                
            </div>
        </div>
    </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize'

export default {
    name: 'PictureBox',
    props: {
        codedimg: String,
        staticimg: String
    },
    components:{
        VueDragResize
    },
    data() {
        return {
            image_a: '',
            image_b: '',
            width: 0,
            height: 0,
            top: 0,
            left: 0

        }
    },
    mounted(){
    },
    methods: {
        resize(newRect) {
            this.width = newRect.width;
            this.height = newRect.height;
            this.top = newRect.top;
            this.left = newRect.left;
        }
    }
}
</script>

<style lang="scss">
  @import '@/scss/main.scss';

  .picturebox {
      padding: rem(10);
      background-color: white;
      width: rem(750);
      height: rem(350);
      display: flex;
      flex-flow: row wrap;

      &__image{
          position: absolute;
          top: 0;
          left: 0;
          margin: rem(8);
          width: rem(350);
          height: auto;
      }
  }
</style>