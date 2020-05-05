<template>
  <q-page padding class="flex flex-top">      

		<q-card inline text-color="black" style="width:98%">
			  <q-card-section>	
				<div class="col-12 q-pa-lg text-caption">
				  <div class="text-bold">Instrucciones:</div>
				  <div>Pulse el botón con el micrófono
					 <q-btn dense color="primary" round size="xs" icon="keyboard_voice" />
					 para iniciar la captura de voz o digite las palabras que desea buscar.
				  </div>
				</div>
			  </div>
			</q-card-section>				  

			  <q-card-section>
					<div class="row q-col-gutter-md q-pt-md">
						  <div class="col-6 q-pt-md">
							<q-btn
							  push color="primary"
							  round size="lg" icon="keyboard_voice"
							  class="float-right"
							  @click="grabar()"/>
						  </div>
						  <div class="col-12 text-center">
							<q-input size="xl" @focus="buscarFocusNombre" :loading="lbBuscando" class="text-h6"  v-model="nombre" type="text"  rows="2" placeholder="Descripción del producto" />						</q-input>
						  </div>
					</div>			  
			  </q-card-section>				  
			 <q-card-actions>
				<q-btn flat class="bg-red " color="white" @click="buscarProducto"  icon="search" >Buscar</q-btn>
				<q-btn flat autofocus class="bg-red " color="white" @click="$router.push('/')" >Cancelar</q-btn>							
			</q-card-actions>
						
		</q-card>			
	     <q-page-sticky v-if="btnStop" position="bottom-right" :offset="[15, 18]" style="z-index: 10000">
        <q-btn fab icon="stop" color="negative" @click="stop()" />
      </q-page-sticky>


</q-page>
</template>

<style>
</style>

<script>

import { QSpinnerFacebook } from 'quasar'

export default {
  name: 'PageIndex',
  data () {
    return {
	  nombre:'',
      intcodbarra: null,
	  lbBuscando: false,
	  existedisp: null,
	  costo: "",
	  presindes: "",
	  precio: "",
      text: '',
      voiceSelect: 'es-ES',
      optionsVoice: [],
      continuous: false,
      btnStop: false,
	  reconocimientoHabiliado: false,
	  tienePermisos: false,

    }
  },  
  mounted () {
    this.setVoices()
  },
  computed: {  
    precioVenta: function () {      	
      return "$"+this.precio}    
  },  
  methods: {
  
    chequearReconocimiento(){
		this.reconocimientoHabiliado = true
		window.plugins.speechRecognition.isRecognitionAvailable((available)=>{
			if(!available){
			this.reconocimientoHabiliado = false
		}
	})
	},

    chequearPermisos(){
		this.tienePermisos = true
		window.plugins.speechRecognition.requestPermission(()=>{
				this.tienePermisos = true
			},(err)=>{
				this.tienePermisos = false
			})				
	},
	
    grabar(){
	
		var tipo = typeof cordova 		
		
		if(tipo!="undefined"){	
		
		    this.chequearReconocimiento()
			
			if(!this.reconocimientoHabiliado){
				alert("reconocimiento de voz NO habilitado")
				return
			}
			this.chequearPermisos()
			if(!this.tienePermisos){
				alert("No posee permisos para grabar voz")
				return
			}
		
		window.plugins.speechRecognition.startListening((result)=>{
		    this.nombre = result[0]
			this.buscarProducto()
		},(err)=>{
			alert(err)
		}, {
			language: "es-ES",
			showPopup: true
		});		
		
		}		
	},
	show (options) {
      this.$q.loading.show(options)
      setTimeout(() => {
        this.$q.loading.hide()
      }, 15000)
    },  
	procesarEntrada(){
	},
	limpiarValores(){
	  this.intcodbarra = null;
	  this.nombre      = "";
	  this.existedisp  = null;	  
	  this.precio      = "";
	  this.costo       = "";
	  this.presindes   = "";

	},
    buscarFocusCodigo(){
	  this.limpiarValores();
	},
    buscarFocusNombre(){
		this.limpiarValores();
	},	
	buscarProducto() {
		
		this.show({
			spinner: QSpinnerFacebook,
			spinnerColor: 'amber',
			spinnerSize: 100
		  })	
		  
		var url         = 'http://santarossa.ddns.net:1337/consultaPrecios';
		this.lbBuscando = true;
		this.existedisp = null;	
		this.precio     = "";
		this.costo      = "";
		this.presindes  = "";
		this.$axios.post(url,{intcodbarra: this.intcodbarra,strnombre: this.nombre})
		  .then((response) => {	   
		  
			this.$q.loading.hide()
			var json        = response.data;
			
			//alert(JSON.stringify(json))
			
			if (json.length>1){	
				this.$q.localStorage.set("listaProductos", json);
				this.$router.push('/listaProductos');				
				}
			else {			
			   if (json.length>0){				   
				this.$q.localStorage.set("listaProductos", json);				
				this.$router.push('/detalleProducto');				
				}else{
				this.notificar();
				}
			}	
		  })
		  .catch(() => {	    
			this.lbBuscando = false;
			this.$q.loading.hide();
			this.$q.notify({
			  color: 'negative',
			  position: 'bottom',
			  message: 'No se encontraron datos para esta búsqueda',
			  icon: 'report_problem'
			})
			//setTimeout(() => { this.leerQR() }, 500);					
		  })
	  },  
	  
    showNotification () {	  
      this.$q.notify('Error en la conexión')
    },
	
    setVoices () {
      let id = setInterval(() => {
        if (this.optionsVoice.length === 0) {
          this.voicesList()
        } else {
          clearInterval(id)
        }
      }, 50)
    },
    voicesList () {
      let teste = window.speechSynthesis
      this.optionsVoice = teste.getVoices().map(voice => ({
        label: voice.name, value: voice.lang
      }))
    },
    playAudio () {
      this.$speechTalk(this.voiceSelect, this.nombre)
    },	
    record () {
      this.btnStop = true
      this.$speechToText.start(this.voiceSelect, this.continuous)
        .then((suc) => {
        
          this.nombre += ' ' + suc
          if (this.continuous) {
            this.record()
          } else {
            this.btnStop = false
          }
		  this.buscarProducto()
        })
        .catch(() => {
          console.log('error en retorno')
          this.btnStop = false
        })
    },
    stop () {
      this.$speechToText.stop()
      this.btnStop = false
    }
	
  }
}
</script>
