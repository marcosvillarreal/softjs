<template>
  <q-page padding class="docs-table">
    <div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
      <br>
        <q-btn @click="$router.push('/consultaCtacte')"  icon="home" color="primary" />
        <q-btn @click="generarPDF"  icon="pdf" color="primary" label="PDF" />
		  <br>
      <br>
      <div id='content'>
        <q-table

          :data="tableData"
          :columns="columns"
          :filter="filter"
          :visible-columns="visibleColumns"
          :separator="separator"
          :selection="selection"
          :selected.sync="selected"
          :pagination.sync="pagination"
          row-key="row_key"
          color="secondary"

        >
          <template slot="top-left" slot-scope="props">
            <q-search
              hide-underline
              color="secondary"
              v-model="filter"
              class="col-6"
              label="Comprobante"
            />
          </template>
          <template slot="top-right" slot-scope="props">
            <q-table-columns
              color="secondary"
              class="q-mr-sm"
              v-model="visibleColumns"
              :columns="columns"
              label="Columnas"
            />
            <q-select
              color="secondary"
              v-model="separator"
              :options="[
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
                { label: 'Cell', value: 'cell' },
                { label: 'None', value: 'none' }
              ]"
              hide-underline
            />
            <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
            />
          </template>
        </q-table>
      </div>
    </div>
    <div id='elementH'></div>
  </q-page>
</template>

<script>
// jQuery library
// src="js/jquery.min.js"
// jsPDF library
// src="js/jsPDF/dist/jspdf.min.js"
// import JsPDF from './../../plugins/jsPDF.js'

// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// import html2canvas from "html2canvas"

// import tableData from 'assets/table-data'
export default {
  name: 'resumen',
  data () {
    return {
      //
      /*
      tableData,
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      visibleColumns: ['desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'],
      */
      tableData: this.$q.localStorage.get.item('movCtacte'),
      columns: [
        { name: 'comprobante', required: true, label: 'Comprobantes', align: 'left', field: 'comproba', sortable: true },
        { name: 'fecha_emi', label: 'F.Emisión', field: 'fechaemi', sortable: true },
        { name: 'total', label: 'Total', field: 'importe', sortable: true },
        { name: 'debe', label: 'Debe', field: 'debe', sortable: true },
        { name: 'haber', label: 'Haber', field: 'haber', sortable: true },
        { name: 'saldo', label: 'Saldo', field: 'saldoacu', sortable: true }


      ],
      visibleColumns: ['comprobante', 'fecha_emi', 'debe', 'haber', 'saldo'],
      row_key: 'name',
      filter: '',
      separator: 'horizontal',
      selection: 'multiple',
      selected: [
        // initial selection
        // { name: 'Ice cream sandwich' }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 15
      },
      paginationControl: { rowsPerPage: 3, page: 1 },
      loading: false,
      dark: true,
      selectedSecond: [
        { name: 'Eclair' }
      ]
    }
  },
  watch: {
    'paginationControl.page' (page) {
      this.$q.notify({
        color: 'secondary',
        message: `Navigated to page ${page}`,
        actions: page < 4
          ? [{
            label: 'Go to last page',
            handler: () => {
              this.paginationControl.page = 4
            }
          }]
          : null
      })
    }
  },
  computed: {

    tableClass () {
      if (this.dark) {
          return 'bg-black'
      }
    }

  },
  methods: {
    deleteRow () {
      this.$q.notify({
        color: 'secondary',
        icon: 'delete',
        message: `Will delete the selected row${this.selectedSecond.length > 1 ? 's' : ''} later, ok?`
      })
    },

    /*
    generarPDF () {
      var doc = new JsPDF()
      var elementHTML = document.getElementById('doc-table').html()
      var specialElementHandlers = document.getElementById('elementH', function (element, renderer) {
        return true
      });

      doc.fromHTML(elementHTML, 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
      }),

      // Save the PDF
      doc.save('sample-document.pdf')
    }
    
    generarPDF () {
      var vm = this
      var columns = [
        {title: 'Comprobante', dataKey: 'comproba'},
        {title: 'F.Emision', dataKey: 'fechaemi'},
        {title: 'Debe', dataKey: 'debe'},
        {title: 'Haber', dataKey: 'haber'},
        {title: 'Saldo', dataKey: 'saldoacu'}
      ]
      const doc = new jsPDF('p', 'pt')
      doc.autoTable(columns, vm.tableData)



      doc.save('sample.pdf')

    }
	*/
  }
}
</script>
