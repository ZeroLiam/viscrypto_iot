<template>
    <div class="picturebox">
        <!-- Title and load button -->
        <div class="picturebox__title" :class="{'found': title === 'MESSAGE FOUND!'}">{{title}}</div>
        <!--  Actual input file button, hidden so we can stylize it
          later on the dropfile__add section -->
        <div class="picturebox__input">
            <label class="input-label">
                <input type="file" id="files" ref="files" accept="image/*" @change="handleFilesUpload()"/>
            </label>
        </div>
        
        <button class="button getEncodedImages_btn" @click="addFiles()">Get Encoded Images</button>

        <!-- Encoded pictures container -->
        <!-- <div class="l-picturebox-container"> -->
            <!-- <VueDragResize :isActive="false" :isResizable="false"  :isDraggable="true" @dragstop="onDragstop" :aspectRatio="true" class="picturebox__image"> -->
                <!-- <img class="imga" src="~@/assets/testimg/github120-share-1.png" /> -->
                <!-- <img class="imga" v-bind:ref="`image_a${parseInt(k)}`"/> -->
            <!-- </VueDragResize> -->
            <!-- <VueDragResize :isActive="true" :isResizable="false"   :isDraggable="true" @dragstop="onDragstop" :aspectRatio="true" class="picturebox__image"> -->
                <!-- <img class="imgb" src="~@/assets/testimg/github120-share-2.png" /> -->
                <!-- <img class="imgb" v-bind:ref="`image_b${parseInt(k)}`"/> -->
            <!-- </VueDragResize> -->
        <!-- </div> -->

        <div class="l-picturebox-container">
            <div v-for="(file, k) in files" :key="k" >
                <VueDragResize :isActive="false" :isResizable="false"  :isDraggable="true" @dragstop="onDragstop" :aspectRatio="true" class="picturebox__image">
                    <img class="img-preview imga" :src="loadedImages['image_a']"/>
                </VueDragResize>
                <VueDragResize :isActive="false" :isResizable="false"  :isDraggable="true" @dragstop="onDragstop" :aspectRatio="true" class="picturebox__image">
                    <img class="img-preview imgb" :src="loadedImages['image_b']"/>
                </VueDragResize>
            </div>
        </div>

        <!-- Remove pictures -->
        <button class="button removeImages_btn">Remove Images</button>
    </div>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import visCrypto from './../../algorithm_core/viscrypto_core'

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
            image_a: document.getElementsByClassName('imga'),
            image_b: document.getElementsByClassName('imgb'),
            loadedImages: {image_a: '', image_b: ''},
            title: 'Drag one box on top of the other to reveal the hidden picture',
            decoded: false,
            files: []//all files we're uploading
        }
    },
    mounted(){
    },
    methods: {
        
      //Add files from the input
      addFiles(){
        this.$refs.files.click();
      },
      //Handles the uploading of files
      handleFilesUpload(){
        let uploadedFiles = this.$refs.files.files;

        //Adds the uploaded file to the files array
        for( var i = 0; i < uploadedFiles.length; i++ ){
          this.files.push(uploadedFiles[i]);
        }
        //Get image previews for the files
        this.generateEncodedImages();
      },
        generateEncodedImages(){
            //visCrypto.init('./src/renderer/assets/testimg/github120.png', './src/renderer/assets/testimg/github120-share-1.png', './src/renderer/assets/testimg/github120-share-2.png');
            console.log(this.files);
            var filepathName = this.files[0].path.replace( /\.(jpe?g|png|gif)$/i, '');
            console.log(filepathName);
            this.loadedImages['image_a'] = './testimg/share-1.png';
            this.loadedImages['image_b'] = './testimg/share-2.png';
            
            visCrypto.init(filepathName + '.png', this.loadedImages['image_a'], this.loadedImages['image_b']);
            this.title = `${filepathName} + '.png', ${this.loadedImages['image_a']}, ${this.loadedImages['image_b']}`
        },
        onDragstop(){
            var match_images = {
                'a': {'x': this.image_a[0].x, 'y': this.image_a[0].y, 'classList': this.image_a[0].classList},
                'b': {'x': this.image_b[0].x, 'y': this.image_b[0].y, 'classList': this.image_a[0].classList},
            };
            // console.log("image A: ",this.image_a);
            // console.log("image B: ",this.image_b);
            // console.table(match_images);

            if(match_images['a']['x'] === match_images['b']['x'] && match_images['a']['y'] === match_images['b']['y']){
                console.log("MESSAGE FOUND!");
                this.title = 'MESSAGE FOUND!';
                match_images['a']['classList'].add('foundmatch');
                match_images['b']['classList'].add('foundmatch');
            }else{
                this.title = 'Drag one box on top of the other to reveal the hidden picture';
                match_images['a']['classList'].remove('foundmatch');
                match_images['b']['classList'].remove('foundmatch');
            }
        }
    }
}
</script>

<style lang="scss">
  @import '@/scss/main.scss';
    @keyframes makeborder {
        from{
            outline: 0 solid $success;
        }
        to{
            outline: rem(4) solid $success;
        }
    }

  .picturebox {

      .l-picturebox-container{
        background-color: $light;
        background-image: url("./../../assets/logobg.png");
        background-position: center center;
        background-repeat: no-repeat;
        padding: rem(10);
        width: rem(750);
        height: rem(350);
        display: flex;
        flex-flow: row wrap;
        overflow: hidden;
      }

        input[type="file"]{
            visibility: hidden;
            width: 0px;
        }

        &__input{
            visibility: hidden;
            width: 0px;
        }
      &__title {
          margin: 0 0 rem(20) 0;
          color: $ribbon;
          font-size: rem(16);

          &.found{
              color: $success;
              font-size: rem(20);
          }
      }
      &__image{
        margin: rem(8);
        width: rem(365);
        height: auto;

        .foundmatch {
            outline: rem(4) solid $success;
            animation-duration: 0.8s;
            animation-name: makeborder;
        }

        .imga{
            max-height: rem(325);
            position: absolute;
            top: 0;
            left: 0;
            cursor: -webkit-grab;
            &:active{
                cursor: -webkit-grabbing;
            }
        }

        .imgb{
            max-height: rem(325);
            position: absolute;
            top: 0;
            left: 250%;
            cursor: -webkit-grab;
            &:active{
                cursor: -webkit-grabbing;
            }
        }

        // HEY! BE CAREFUL! This is the .active class from the VueDragResize component
        &.active{
            &::before {
                display: none;
            }
        }

      }
  }
</style>