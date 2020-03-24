<template>
  <q-page padding class="row justify-center">
	<div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
		<q-list>
			<q-list-header inset>TIENDAS</q-list-header>
			
			</q-item>
				<q-item-side>
					<q-btn round color="secondary" icon="person_add" @click="$router.push('/nuevaTienda')" />
				</q-item-side>
				
				<q-item-main>
					<q-item-tile label>Nueva Tienda</q-item-tile>
				</q-item-main>
				
				<q-item-side right>
				</q-item-side>
			</q-item>
			
			<q-item-separator inset />
			
			<q-item v-for="(item, index) in listaTienda" :key="index" color="amber" >
				<q-item-side>
				</q-item-side>
					
				<q-item-main>
					<q-item-tile label>{{item.businessname}}</q-item-tile>
				</q-item-main>
					
				<q-item-side right>
					<q-btn round color="secondary" icon="store" @click="$router.push('/nuevoPedido')" />
				</q-item-side>
				
			</q-item>
			<q-item-separator inset />
		</q-list>
	</div>
</q-page>
</template>

<script>
export default {
  name: 'listaTienda',
  data () {
    return {
	  listaTienda: this.$q.localStorage.get.item('UserLogin')
    }
  }
}
</script>

<style>
</style>
