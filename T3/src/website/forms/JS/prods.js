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

      $.post('http://localhost:3000/addProduct', {prodname, description, preco, estoque, qtdeVendida, image});

}

function showProds(e){
    var transaction = db.transaction(["Produtos"], 'readonly');
    var os = transaction.objectStore("Produtos");
    var index = os.index('prodname');

    var output="";

    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;

        if(cursor){
            output += "<tr id='prod_"+cursor.value.ID+"'>";
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='prodname' data-id="+cursor.value.ID+">"+cursor.value.prodname+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='description' data-id="+cursor.value.ID+">"+cursor.value.description+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='preco' data-id="+cursor.value.ID+">"+cursor.value.preco+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='estoque' data-id="+cursor.value.ID+">"+cursor.value.estoque+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='qtdeVendida' data-id="+cursor.value.ID+">"+cursor.value.qtdeVendida+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true' data-field='image' data-id="+cursor.value.ID+">"+cursor.value.image+"</td>";
            output += "<td><a onclick=\"removeProd("+cursor.value.ID+")\" href=\'\'><i class=\"material-icons\" style=\"color: crimson;\">delete</i></a></td>";

            output += "</tr>";
            cursor.continue();

        }

        $('#Lprods').html(output);
    }
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
