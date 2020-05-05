<template>
  <q-page padding>    
	<!-- <div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">		-->
	<div style="width:100%;">
			<!--<q-btn @click="$router.push('/')" align="center" size="md" class="bg-red" color="white">Productos coincidentes</q-btn>-->	

		<div class="q-pa-md">
			<q-table
			  class="my-sticky-virtscroll-table"
			  virtual-scroll
			  table-style="max-height: 800px"
			  :pagination.sync="pagination"
			  :rows-per-page-options="[0]"
			  :virtual-scroll-sticky-start="48"
			  row-key="nombre"
			  :dense="$q.screen.lt.md"
			  title="Lista de productos"
			  :data="data"
			  :columns="columns"			  
			>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="nombre" :props="props">
							<div class="my-table-details">
							{{ props.row.nombre }}{{ props.row.nomvariedad }}
							</div>
						</q-td>
						<q-td key="precio" :props="props">
							<div class="my-table-details2" style="font-weight:normal">						
							  ${{parseFloat(props.row.prevtaf1).toFixed(1)}}						
							 </div> 
						</q-td>					  
						<q-td key="precio" :props="props">												
							<div class="my-table-details2" style="font-weight:normal" v-if="props.row.canbase>1">								  
								${{parseFloat(props.row.prevtaporcant).toFixed(1)}}
								<q-badge outline floating color="green" v-if="props.row.canbase>1">									
								x{{props.row.canbase}} o más
								</q-badge>								
							</div> 			 
						</q-td>					  						
					</q-tr>
               </template>
		   </q-table>
		  </div>

	</div>
    <q-page-sticky  position="bottom-right" :offset="[15, 18]" style="z-index: 10000">
       <q-btn fab icon="skip_previous" color="negative" @click="$router.go(-1)" />
    </q-page-sticky>

</q-page>
</template>

<script>

export default {
	name: 'listaProductos',
	data () {
    return {
	pagination: {
        sortBy: 'precio',
        descending: false,
        rowsPerPage: 0
        // rowsNumber: xx if getting data from a server
      },	
		data:this.$q.localStorage.getItem("listaProductos"),
	 columns: [
			{ name: 'nombre', align: 'left', label: 'DESCRIPCION',
			field: row => row.nombre,			
			sortable: true },
			{ name: 'precio', label: 'PRECIO', field: 'prevtaf1' , sortable: true , format: val => '$'+`${val}`,style: 'max-width: 150px;',headerStyle: 'width: 150px;'},
			{ name: 'precio2', label: 'OFERTA', field: 'prevtaporcant' , sortable: false ,style: 'max-width: 150px;',headerStyle: 'width: 150px;'}
			
		  ],
		pagination: {
		rowsPerPage: 0
		},
		listaProductos:this.$q.localStorage.getItem("listaProductos"),
		margen:this.$q.localStorage.getItem("margen")      
    }
  }  ,  
 mounted () {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },  
  computed: {  
    precioVenta: function () {      	
      return this.listaProductos[0].prevtaf1*(1+this.margen/100)}    
	  ,
    labelOferta: function() {   
      var strRet = ""
	  if (parseFloat(this.listaProductos[0].canbase).toFixed(0)>1){
	  	  return "x "+this.listaProductos[0].canbase+" o más";    
	  } else {
	  	  return "";    
	  }
	  //return "Por 9 unidades o más";    	   
  },  
 }
}
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* max height is important */
  .q-table__middle
    max-height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: $red-1

  thead tr:first-child th
    position: sticky
    top: 0
    opacity: 1
    z-index: 1
</style>

<style>
.my-table-details {
  font-size: 1.2em;  
  max-width: 200px;
  white-space: normal;  
  margin-top: 4px;
}
.my-table-details2 {
  font-size: 1.2em;  
  max-width: 180px;
  white-space: normal;  
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
