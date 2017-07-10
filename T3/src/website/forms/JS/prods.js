'use strict';

let db;

$(document).ready(() => {
    var request=indexedDB.open('Prods',1);

    request.onsuccess=function(e){
       db=e.target.result;
       console.log("Database's up!");
       showProds();
    };

    request.onerror=function(){
        console.log("Messed up on creating database!");

    };

    request.onupgradeneeded=function(e){
       db=e.target.result;
       if(!db.objectStoreNames.contains("Produtos")){
            var os=db.createObjectStore("Produtos",{keyPath: "ID", autoIncrement: true});
            os.createIndex('prodname','prodname',{unique:false});
            os.createIndex('description', 'description',{unique:false});
            os.createIndex('preco','preco',{unique:false});
            os.createIndex('qtdeVendida','qtdeVendida',{unique:false});
            os.createIndex('estoque','estoque',{unique:false});
            os.createIndex('image','image',{unique:false});
       }
    };
});


function addProd(){

      const prodname=$('input[name=produto]').val();
      const description=$('input[name=descricao]').val();
      const preco=$('input[name=preco]').val();
      const estoque=$('input[name=estoque]').val();
      const qtdeVendida=$('input[name=vendas]').val();
      const image=$('input[name=image]').val();
      const category = 'Product';

      $.post('http://localhost:3000/addProduct', {prodname, description, preco, estoque, qtdeVendida, image, category});

}

function showProds(){
  $(document).ready(function(){
    $.ajax({
      url: "/allProducts",
      type: "POST",
      dataType:"json",
      success: function (response){
        var trHTML = '';
        $.each(response, function (key,value) {
          trHTML +=
              '<tr><td>' + value.id +
              '</td><td>' + value.prodname +
              '</td><td>' + value.description +
              '</td><td>' + value.preco +
              '</td><td>' + value.estoque +
              '</td><td>' + value.qtdeVendida +
              '</td><td>' + value.image +
              '</td></tr>';
            });
          $('#viewProds').append(trHTML);
        }
      });
    });
}

function clearAllProds(){
    if(confirm("Você tem certeza?")==true){
        indexedDB.deleteDatabase('Prods');
        alert("Produtos excluídos :/");
        window.location.href="showProducts.html";
    }
}


function removeProd(ID){
    var transaction = db.transaction(["Produtos"], 'readwrite');
    var os = transaction.objectStore("Produtos");

    var request = os.delete(ID);

    request.onsuccess=function(){
        console.log('Product deleted :/');
        $('#prod_'+ID).remove();
    }

    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}

$('#Lprods').on('blur','.prod', function(){
    var newText=$(this).html();
    var field=$(this).data('field');
    var id=$(this).data('id');

    var transaction = db.transaction(["Produtos"], 'readwrite');
    var os = transaction.objectStore("Produtos");

    var request = os.get(id);

    request.onsuccess=function(){
       var data =  request.result;

       if(field=='prodname'){
           data.prodname=newText;
       }
       else if(field=='description'){
            data.description=newText;
       }
       else if(field=='preco'){
            data.preco=newText;
       }

       else if(field=='estoque'){
            data.estoque=newText;
       }
       else if(field=='qtdeVendida'){
            data.qtdeVendida=newText;
       }
        var requestUpdate = os.put(data);

        requestUpdate.onsuccess=function(){
            console.log('Value Updated');
        }
        requestUpdate.onerror=function(e){
            alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
        }
    }

    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
});
