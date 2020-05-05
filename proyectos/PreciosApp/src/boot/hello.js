import hello from 'hellojs'

//wtVC2EMbmsxokd7Ndaeq7a1w client secret

export default ({ Vue }) => {
  hello.init({
	facebook: '904685279960753',  
    google: '820889085028-m468ihdimv0eac5llr8v9gr5t3omf8rm.apps.googleusercontent.com'
  }
  )
  Vue.prototype.$hello = hello
}