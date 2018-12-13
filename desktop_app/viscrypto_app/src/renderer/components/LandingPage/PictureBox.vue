<template>
    <div class="picturebox">
        <div class="l-picturebox-container">
            <VueDragResize :isActive="false" :isResizable="false" 
            :isDraggable="true"  :aspectRatio="true" class="picturebox__image">
                <img class="imga" src="~@/assets/testimg/github-share-1.png" />
            </VueDragResize>
            <VueDragResize :isActive="true" :isResizable="false"  
            :isDraggable="true"  @dragstop="onDragstop" @dragging="onDragging" :aspectRatio="true" class="picturebox__image">
                <img class="imgb" src="~@/assets/testimg/github-share-2.png" />
            </VueDragResize>
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
            image_a: document.getElementsByClassName('imga')[0],
            image_b: document.getElementsByClassName('imgb')[0],
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
            console.log("newRect: ", newRect);
            this.width = newRect.width;
            this.height = newRect.height;
            this.top = newRect.top;
            this.left = newRect.left;
        },
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
      overflow: hidden;

      &__image{
        margin: rem(8);
        width: rem(365);
        height: auto;

        .foundmatch {
            border: 2px solid $success;
        }

        .imga{
            max-height: rem(325);
            position: absolute;
            top: 0;
            left: 0;
        }

        .imgb{
            max-height: rem(325);
            position: absolute;
            top: 0;
            left: 250%;
        }

        &.active{
            &::before {
                display: none;
            }
        }

      }
  }
</style>