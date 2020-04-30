<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-toolbar-title>
          Mobile Distribuidora
          <div slot="subtitle">Versión v1.01.3</div>
          <div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
            <!--
            <img alt="Distribuidora" src="~assets/logo-header_1.jpg">
            -->
        </div>
        </q-toolbar-title>
      </q-toolbar>

    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>

</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
