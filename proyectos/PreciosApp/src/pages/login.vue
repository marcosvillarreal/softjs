<template>
  <q-page padding class="flex flex-top">      	

	<div class="column q-pa-lg">

		  <div class="row">
			<q-card square class="shadow-24" style="width:300px;height:485px;">
			  <q-card-section class="bg-deep-purple-7">
				<h4 class="text-h5 text-white q-my-md">Acceso</h4>
				<div class="absolute-bottom-right q-pr-md" style="transform: translateY(50%);">
				  <q-btn fab icon="add" color="purple-4" />
				</div>
			  </q-card-section>
			  <q-card-section>
				<q-form class="q-px-sm q-pt-xl">
				  <q-input square clearable v-model="login.email" type="email" label="Email">
					<template v-slot:prepend>
					  <q-icon name="email" />
					</template>
				  </q-input>
				  <q-input square clearable v-model="login.password" type="password" label="Password">
					<template v-slot:prepend>
					  <q-icon name="lock" />
					</template>
				  </q-input>
				</q-form>
			  </q-card-section>
			  <q-card-section>
				<div class="text-center q-pa-md q-gutter-md">
				  <q-btn round color="indigo-7" @click="auth('facebook')">
					<q-icon name="fab fa-facebook-f" size="1.2rem" />
				  </q-btn>
				  <q-btn round color="red-8" @click="auth('google')">
					<q-icon name="fab fa-google-plus-g" size="1.2rem" />
				  </q-btn>
				  <q-btn round color="light-blue-5" @click="auth('facebook')">
					<q-icon name="fab fa-twitter" size="1.2rem" />
				  </q-btn>
				</div>
			  </q-card-section>
			  <q-card-actions class="q-px-lg">
				<q-btn unelevated size="lg" color="purple-4" class="full-width text-white" label="Ingresar" />
			  </q-card-actions>
			  <q-card-section class="text-center q-pa-sm">
				<p class="text-grey-6">Olvidaste tu clave?</p>
			  </q-card-section>
			</q-card>
		  </div>
		</div>

    </q-page>
</template>

<style>
/* style inputs and link buttons */
input,
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  margin: 5px 0;
  opacity: 0.85;
  display: inline-block;
  font-size: 17px;
  line-height: 20px;
  text-decoration: none; /* remove underline from anchors */
}
/* style the submit button */
input[type=submit] {
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}
/* add appropriate colors to fb, twitter and google buttons */
.fb {
  background-color: #3B5998;
  color: white;
}

.twitter {
  background-color: #55ACEE;
  color: white;
}

.google {
  background-color: #dd4b39;
  color: white;
}

</style>

<script>

export default {
  name: 'Login',
	data() {
    return {
      conectado: 0,
      slide: 1,
      conectado: 0,
      respuesta: "",
      urlLogin:
        "http://172.18.4.72:70/sse_generico/espanol/generico_login_M4ADM.jsp",
      login: {
        email: "",
        password: "",
        username: ""
      }
    };
  },  
  methods: {	
  notificar(texto) {
      this.lbBuscando = false;
      this.$q.loading.hide();
      this.$q.notify({
        color: "negative",
        position: "bottom",
        message: texto,
        icon: "report_problem"
      });
    },	  
    auth (network) {
	
	  var tipo   = typeof cordova;	  
	  
	  var strUri = ''
	  if (tipo != "undefined") {
		 strUri = 'https://adodson.com/hello.js/redirect.html'
	  }

	
	  this.$q.localStorage.set("redsocial", network);
	  
	  if(network=='facebook'){
		this.$hello(network).login({ scope: 'email' })
			.then(() => {
				this.$router.push('profile')
			})
	  }	
	  
	  if(network=='google'){
		   //	strUri =  'http://localhost/login'
			this.$hello(network).login({display:'popup',force:false,response_type: 'token id_token', scope: 'email',redirect_uri:strUri})
				.then(() => {						   				   
				   this.$router.push('profile')
				}, (e)=> {
					alert('Signin error: ' + e.error.message);
					}
				)
										
			
	  }	
		
    }
  }
}
</script>

