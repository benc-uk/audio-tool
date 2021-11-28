import { AudioView } from './audio-view.js'

let source = null
let audioCtx = null

export const App = {
  components: {
    'audio-view': AudioView
  },

  data: () => {
    return {
      audioData: null
    }
  },

  created() {
    audioCtx = new AudioContext()
  },

  methods: {
    // load audio file from upload
    loadFile(evt) {
      const reader = new FileReader()
      reader.onload = () => {
        audioCtx.decodeAudioData(reader.result, (audioBuffer) => {
          this.audioData = audioBuffer
          const source = audioCtx.createBufferSource()
          source.buffer = this.audioData
          source.connect(audioCtx.destination)
          source.start()
        })
      }

      reader.readAsArrayBuffer(evt.target.files[0])
    },

    play() {
      const source = audioCtx.createBufferSource()
      source.buffer = this.audioData
      source.connect(audioCtx.destination)
      source.start()
    }
  },

  template: `
  <div>
    <nav class="navbar is-primary">
    <div class="navbar-brand">
      <div class="navbar-item" >
        <div class="title is-4 has-text-dark">🔊 AudioTool</div>
      </div>
    </div>
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-link" @click="loadFile">
            <strong>Load File</strong>
          </a>
          <a class="button is-link">
            <strong>Export Slices</strong>
          </a>
        </div>
      </div>
    </nav>
    <section class="section">
      <input type="file" id="input" @change="loadFile">
      <button class="button is-success" @click="play">▶️</button>
      <audio-view :audioData="audioData"></audio-view>
    </section>
  </div>
  `
}
