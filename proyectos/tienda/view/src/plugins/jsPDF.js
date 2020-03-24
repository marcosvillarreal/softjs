import jsPDF from 'jsPDF'

export default ({ Vue }) => {
  Vue.prototype.$jsPDF = jsPDF
}
