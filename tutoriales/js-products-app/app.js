//alert("Trabajando!");

class Product {
    constructor(name, price, year){
        this.name = name;
        this.price = price;
        this.year = year;
    }
}

class UI {
    addProduct(product) {
        const productList = document.getElementById("product-list");
        const elemnt = document.createElement("div");
        //Alt+96
        elemnt.innerHTML = `
            <div class="card text-center mb-4" >
                <div class="card-body">
                    <strong>Producto Descripcion</strong>: ${product.name}
                    <strong>Producto Precio</strong>: ${product.price}
                    <strong>Producto Año</strong>: ${product.year}
                    <a class="btn btn-danger" href="#" name="delete">Delete</a>
                </div>
            </div>
        `;
        productList.appendChild(elemnt);
        this.resetForm();
        this.showMessage('Producto agregado satifactoriamente','success');
    }
    
    resetForm(){
        document.getElementById('product-form').reset();
    }

    deleteProducto(element){
        if(element.name === 'delete') {
            element.parentElement.parentElement.parentElement.remove();
            this.showMessage('Producto eliminado correctamente', 'success')
        }
    }

    showMessage(message, cssClass){
        const div = document.createElement('div');
        div.className = `alert alert-${cssClass} mt-4`;
        div.appendChild(document.createTextNode(message));
        //Mostrando en el DOM
        const container = document.querySelector('.container');
        const app = document.querySelector('#App');

        container.insertBefore(div, app);
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
}
//DOM Event
document.getElementById("product-form")
    .addEventListener("submit", function(e){
        //alert('Enviando formulario')
      
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const year = document.getElementById("year").value;

        //console.log(name, price, year);
        const product = new Product(name,price,year);

        const ui = new UI();
        if(name=== '' ){
            return ui.showMessage('Complete los campos','danger');
        }
       
        ui.addProduct(product);


       //Cancela el evento de refresco      
        e.preventDefault();
    });

    document.getElementById("product-list")
        .addEventListener('click' , function(e){
            //alert('Eliminando');
            //console.log(e.target);
            const ui = new UI();
            ui.deleteProducto(e.target);
        })
