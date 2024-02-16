<script setup>
import { reactive } from 'vue';

const state = reactive({
    files: [],
    uploading: false,
    isDragOver: false,
})

// imput file
const handleFileChange = (event) => {
  state.uploading = true
  state.files = Array.from(event.target.files).map((file) => ({
    file,
    progress: 0,
    abortController: new AbortController()
  }))
}

// drag and drop
const handleIsDrag = () => {
    state.isDragOver = true
}

const handleDrop = (event) => {
    state.isDragOver = false
    state.uploading = true
    const files = Array.from(event.dataTransfer.files).map((file) => ({
    file,
    progress: 0,
    abortController: new AbortController()
    }));

    state.files = files
}

// cancel upload
const cancelUpload = (fileObj) => {
    const fileIndex = state.files.findIndex((file) => file === fileObj);

    if (fileIndex !== -1) {
        fileObj.abortController.abort()
    }
}

const uploadFile = async (fileObj) => {
    const formData = new FormData()
    formData.append(fileObj.file.name, fileObj.file)

    //  todo ReadableStream
    const fileStream = formData.get(fileObj.file.name).stream().getReader()
    console.log('fileStream', fileStream)
    const totalSize = fileObj.file.size
    let uploaded = 0
    
    const rs = new ReadableStream({
      async pull(ctrl){
        const result = await fileStream.read()
        console.log('Read:', result)
        if(result.done){
          ctrl.close()
          return
        }
        uploaded += result.value.byteLength
        fileObj.progress = (uploaded / totalSize) * 100
        console.log('uploaded', uploaded)
        ctrl.enqueue(result.value)
      }
    })

    try {
      console.time('useFetch:')
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: rs,
        duplex: 'half',
        signal: fileObj.abortController.signal
      })
      console.timeEnd('useFetch:')
    } catch (error) {
      console.error('Upload error', error);
    }
}

const uploadFiles = async () => {
    if(state.files.length === 0){
      alert('No selected file!')
      return
    }else{
      try {
        await Promise.all(state.files.map(file => uploadFile(file)));
        alert('All done');
      } catch (error) {
        console.error(error);
        alert('Something error ><');
      } finally {
        state.uploading = false;
        state.files = [];
      }
    }
}
</script>

<template>
    <div class="container">
      <p>ReadableStream</p>
      <div
        @dragenter.prevent="handleIsDrag"
        @dragover.prevent="handleIsDrag"
        @dragleave.prevent="handleIsDrag"
        @drop.prevent="handleDrop"
        class="drop-area"
        :class="{ 'drag-over': state.isDragOver }"
        >
        <label class="input-label">
          <input type="file" @change="handleFileChange" multiple/>
          <span>+</span>
        </label>
      </div>
      <button @click="uploadFiles">Upload</button>
      <div v-if="state.uploading">
        <div v-for="(fileObj, index) in state.files" :key="index" class="progress">
          <p>{{ fileObj.file.name }}</p>
          <v-progress-linear
            rounded
            color="primary"
            v-model="fileObj.progress"
            height="25px"
            class="linebar">
            <strong>{{ Math.ceil(fileObj.progress) }}%</strong>
          </v-progress-linear>
          <button @click="() => cancelUpload(fileObj)" class="cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
</template>

<style scoped>
.container{
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-direction: column;
  border-radius: 25px;
  height: 80vh;
  width: 100%;
  padding: 1rem;
}

.drop-area {
  width: 15vw;
  height: 20vh;
  border: 2px dashed #ccc;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-over {
  border-color: #2196F3;
  background-color: #E3F2FD;
}

.input-label{
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(225, 225, 225, 0.6);
  width: 100%;
  height: 100%;
  border-radius: 25px;
  cursor: pointer;

  input{
    display: none;
  }
  span{
    font-size: 3rem;
    font-weight: 500;
  }
}

button{
  padding: 0.5rem;
  border-radius: 25px;
  background-color: lightblue;
  font-size: 1rem;
}

.progress{
  width: 45vw;
  margin-top: 1rem;
  display: grid;
  gap: 1.5rem;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 3fr 1fr;

  p{
    grid-column: 1/2;
    align-self: center;
  }
  .linebar{
    grid-column: 2/3;
    align-self: center;
  }
}

.cancel{
  width: 60%;
  border-radius: 25px;
  padding: 0.5rem;
  background-color: pink;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 3/4;
  align-self: center;
  justify-self: end;
}
</style>