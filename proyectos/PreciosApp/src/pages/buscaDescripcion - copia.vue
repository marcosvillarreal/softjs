<template>
  <q-page padding class="flex flex-top">      

		<q-card inline text-color="black" style="width:98%">
			  <q-card-section>
					<div class="col">
						<div class="text-h6">Búsqueda por descripción
						<q-icon slot="right" color="green" name="find_in_page" size="s"/>
						</div>
						<div class="text-subtitle2">Digite algunas palabras o partes de las mismas
						
						</div>
						
					</div>
					
			  </q-card-section>	
			  <q-card-section>
				<q-input size="xl" autofocus="true" @focus="buscarFocusNombre" :loading="lbBuscando" class="text-h6"  v-model="nombre" type="text"  rows="2" placeholder="Descripción del producto" />
			  </q-card-section>	
			  <q-card-separator />
			 <q-card-actions>
				<q-btn flat class="bg-red " color="white" @click="buscarProducto"  icon="search" >Buscar</q-btn>
				<q-btn flat class="bg-red " color="white" @click="$router.push('/')" >Cancelar</q-btn>							
			</q-card-actions>			  
		</q-card>			

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
	  precio: ""
    }
  },  
  computed: {  
    precioVenta: function () {      	
      return "$"+this.precio}    
  },  
  methods: {
  
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
    }
  }
}
</script>
