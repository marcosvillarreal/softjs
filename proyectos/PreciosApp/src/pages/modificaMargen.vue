<template>
  <q-page padding class="row justify-center">    
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">		
			<q-card inline text-color="black" class="q-ma-sm">
			  <q-card-title>
				Margen de utilidad comercio
				<span slot="subtitle">Digite aquí el nuevo margen de utilidad para calcular el precio sugerido</span>
			  </q-card-title>
			  <q-card-main>				
			  </q-card-main>
			  <q-card-separator />
			  <q-card-actions>
				<q-input autofocus="true" class="justify-end"  type="number" :decimals="1" style="width:95px;font-weight:bold;align:right;"  v-model="margen" float-label="Margen" />				
			  </q-card-actions>
			 <q-card-actions>
				<q-btn flat class="bg-red " color="white" @click="aceptar" >Aceptar</q-btn>			
				<q-btn flat class="bg-red " color="white" @click="$router.push('/')" >Cancelar</q-btn>			
			</q-card-actions>			  
			</q-card>	
	</div>
</q-page>
</template>

<script>
export default {
   name: 'detalleProducto',
  data () {
    return {	  
	  margen:this.$q.localStorage.get.item("margen")
    }
  }
  ,  
  computed: {  
    precioVenta: function () {      	
      return this.listaProductos[0].prevtaf1*(1+this.margen/100)}    
  },  
 methods: {
	aceptar() {	    
		this.$q.localStorage.set("margen",this.margen);
		this.$router.push('/');
    } 
 }  
}
</script>

<style>
</style>
