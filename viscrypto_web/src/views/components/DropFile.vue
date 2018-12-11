<template>
  <div class="dropfile container">

    <!--  Actual input file button, hidden so we can stylize it
          later on the dropfile__add section -->
    <div class="dropfile__input">
      <label class="input-label">Files
        <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()"/>
      </label>
    </div>

    <!-- List files -->
    <div class="dropfile__list">
      <div v-for="(file, k) in files" :key="k" class="file-listing">{{ file.name }} </div>
      <span class="remove-file" @click="removeFile(k)">Remove</span>
    </div>
    
    <!-- Add files -->
    <div class="dropfile__add">
      <button v-on:click="addFiles()" class="button add_btn">Add Files</button>
    </div>
    
    <!-- Submit files -->
    <div class="dropfile__submit">
      <button v-on:click="submitFiles()" class="button submit_btn">Submit</button>
    </div>
  </div>
</template>

<script>
  export default {
    /**
        Hook:       data()
        Purpose:    Holds the variables for this component
                    that can be accessed via this.variablename
     */
    data(){
      return {
        files: []//all files we're uploading
      }
    },
    /**
        Hook:       methods()
        Purpose:    Defines the methods used in the component.
                    Also accessible via this.methodname()
     */
    methods: {
      //Add files from the input
      addFiles(){
        this.$refs.files.click();
      },
      //Submit files to the server
      submitFiles(){
        //Initialize form data
        let formData = new FormData();

        //Iteate over any file sent over appending the files to the form data.
        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];
          formData.append('files[' + i + ']', file);
        }
        
        //Make the request to the POST /select-files URL
        axios.post( '/select-files',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          console.log('Success! Files were uploaded');
        })
        .catch(function(){
          console.log('Sorry, but there was an error uploading the files');
        });
      },
      //Handles the uploading of files
      handleFilesUpload(){
        let uploadedFiles = this.$refs.files.files;
        
        //Adds the uploaded file to the files array
        for( var i = 0; i < uploadedFiles.length; i++ ){
          this.files.push( uploadedFiles[i] );
        }
      },
      //Removes a select file the user has uploaded
      removeFile( key ){
        this.files.splice( key, 1 );
      }
    }
  }
</script>

<style lang="scss">
  @import '@/scss/main.scss';

  .dropfile {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    margin: 0 auto;

    input[type="file"]{
      visibility: hidden;
      width: 0px;
    }

    &__input{
      font-weight: $font-bold;
      color: $primary;
    }
    &__list{
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;

      .remove-file{
        cursor: pointer;
        color: $error;
        margin: 0 0 rem(15) 0;
      }
    }
    &__add{
      .add_btn {
        margin: 0 0 rem(25) 0;
      }
    }
  }

  .button {
    min-width: rem(200);
    margin: 0 auto rem(13) auto;
    padding: rem(16) rem(2)rem(15) rem(2);
    text-align: center;
    font-size: rem(12);
    color: $light;
    border: none;
    background: $button;
    border-radius: rem(10);
    box-shadow: 0px 6px 16px -5px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    &:active {
      color: $dark;
      border: rem(4) solid $button;
      background: none;
    }

    &.disabled {
      color: $light;
      border: none;
      background: $disabled;
      cursor: none;
    }

    &.success {
      color: $light;
      border: none;
      background: $success;
    }

    &.error {
      color: $light;
      border: none;
      background: $error;
    }
  }

</style>
