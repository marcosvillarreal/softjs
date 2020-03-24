<template>
  <q-page padding class="docs-table">
    <div class="q-mt-md q-mr-sm" style="width: 500px; max-width: 90vw;">
      <br>
      <q-btn @click="$router.push('/consultaMovCtacte')"  icon="home" color="primary" />
		  <br>
      <q-btn @click="exportPDF" icon="pdf" color="primary"  label="PDF"/>
  		<br><br>


      <q-table

        :data="tableData"
        :columns="columns"
        :filter="filter"
        :visible-columns="visibleColumns"
        :separator="separator"
        :selection="selection"
        :selected.sync="selected"
        :pagination.sync="pagination"
        row-key="comproba"
        color="secondary"

        :class="tableClass"
        :loading="loading"
      >
        <template slot="top-right" slot-scope="props">

          <q-table-columns
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            :columns="columns"
            label="Columnas"
          />

          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          />
        </template>
        <template slot="top-left" slot-scope="props" class="column">
          <q-select
            v-model="selection"
            stack-label="Tipo de Seleccion"
            hide-underline
            :options="[
              { label: 'Un movimiento', value: 'single' },
              { label: 'Varios movimientos', value: 'multiple' },
              { label: 'Ninguno', value: 'none' }
            ]"
            color="secondary"
            :dark="dark"
            style="min-width: 100px"
          />

          <!--
          <q-toggle
            v-model="dark"
            label="On dark background"
            color="secondary"
            :dark="dark"
          />
          -->

        </template>


      </q-table>


    	</div>
  </q-page>
</template>

<script>

//import tableData from 'assets/table-data'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'resumen',
  data () {
    return {
      tableData: this.$q.localStorage.get.item('movCtacte'),
      columns: [
        { name: 'comprobantes', required: true, label: 'Comprobantes', align: 'left', field: 'comproba', sortable: true },
        { name: 'fechaemi', label: 'F.Emisión', field: 'fechaemi', sortable: true },
        { name: 'total', label: 'Total', field: 'importe', sortable: true },
        { name: 'debe', label: 'Debe', field: 'debe', sortable: true },
        { name: 'haber', label: 'Haber', field: 'haber', sortable: true },
        { name: 'saldo', label: 'Saldo', field: 'saldoacu', sortable: true }


      ],
      visibleColumns: ['comprobantes', 'fechaemi', 'debe','haber','saldo' ],
      //row_key: 'name',
      filter: '',
      separator: 'horizontal',
      selection: 'multiple',
      selected: [{}],
      selected: [
         // initial selection
         { comproba: '' }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 15
      },
      paginationControl: { rowsPerPage: 3, page: 1 },
      loading: false,
      dark: false

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
    exportPDF () {
      var vm =  this
      var columns = [
        {title: "Comprobante", dataKey: "comproba"},
        {title: "Fecha emisión", dataKey: "fechaemi"},
        {title: "Total", dataKey: "importe"},
        {title: "Debe", dataKey: "debe"},
        {title: "Haber", dataKey: "haber"},
        {title: "Saldo", dataKey: "saldoacu"}
      ];
      var doc = new jsPDF('p','pt','a4');
      doc.text('Resumen de Cuenta', 1, 1);
      doc.autoTable(columns, vm.tableData);
      doc.save('Resumen.pdf');

      var pdfOutput = doc.output();
      console.log( pdfOutput );

      /*
      //NEXT SAVE IT TO THE DEVICE'S LOCAL FILE SYSTEM
      console.log("file system...");
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        console.log(fileSystem.name);
        console.log(fileSystem.root.name);
        console.log(fileSystem.root.fullPath);

        fileSystem.root.getFile("Resumen.pdf", {create: true} , function(entry) {
          var fileEntry = entry;
          console.log(entry);

          entry.createWriter(function(writer) {
            write.onwrite = function(evt){
              console.log("write success");
            };
            console.log("writing to file");
            writer.write(pdfOutput);

          })
        })
      });
      */

     /*
     window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
          dir.getFile("test.pdf", {create: true, exclusive: false},
            function (fileEntry) {
              fileEntry.createWriter(function (writer) {
                writer.onwrite = function(evt) {
                  console.log("write success");
                };
                console.log("writing to file");
                writer.write( pdfOutput );
              });
            }
          );
        });
    */
    }
  }
}
</script>
