<template>
  <q-page class="flex flex-center">
    <div>
    <div v-if="profile.id">
      <div class="q-title"></div>
      <p><img :src="profile.picture" ></p>
	  <p>{{profile.name}}</p>
	   <p>{{profile.email}}</p>
    </div>
  </div>
  </q-page>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
	  redsocial:"",
      profile: {}
    }
  },
  mounted () {
	this.redsocial = this.$q.localStorage.getItem("redsocial")
    this.getProfile()
  },
  methods: {
  
    getProfile () {
	  var network = this.$q.localStorage.getItem("redsocial")	  
      if (this.$hello.getAuthResponse(network) == null) {
        return
      }
      this.$hello(network).api('me')
        .then((res) => {		 
          //console.log(res)
          this.profile = res
        })
    }
  }
}
</script>
