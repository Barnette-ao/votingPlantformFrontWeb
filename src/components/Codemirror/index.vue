<template>
	<codemirror v-model="code" :options="cmOptions" @keyup.enter.native="inputCode"/>
</template>

<script>
	// import language js
	// import 'codemirror/mode/javascript/javascript.js'
	// import 'codemirror/mode/shell/shell.js'
	
	// import theme style
	import 'codemirror/theme/base16-dark.css'
	
	export default {
	  data () {
	    return {
	      code: '',
	      cmOptions: {
	        tabSize: 4,
	        mode: 'text/javascript',
	        theme: 'base16-dark',
	        lineNumbers: true,
	        line: true,
	        // more CodeMirror options...
	      }
	    }
	  },
	  methods: {
	    inputCode(){
			console.log("将code传送出去！")
			this.$bus.$emit('transferCode',this.code)
		}
		
	  },
	  // computed: {
	  //   codemirror() {
	  //     return this.$refs.cmEditor.codemirror
	  //   }
	  // },
	  mounted() {
	    console.log('the current CodeMirror instance object:')
	    // you can use this.codemirror to do something...
	  }
	}
	
</script>

