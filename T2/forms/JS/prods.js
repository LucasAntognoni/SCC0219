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
    var prodname=$('input[name=produto]').val();
    var description=$('input[name=descricao]').val();
    var preco=$('input[name=preco]').val();
    var estoque=$('input[name=estoque]').val();
    var qtdeVendida=$('input[name=vendas]').val();
    var image=$('input[name=image]').val();
   
    console.log("product found!");
    var prod={
        prodname:prodname,
        description:description,
        preco:preco,
        estoque:estoque,
        qtdeVendida:qtdeVendida,
        image:image
    }
    
    var transaction=db.transaction(["Produtos"],"readwrite");
    var os=transaction.objectStore("Produtos");
    var request=os.add(prod);

    console.log(request);
    request.onsuccess=function(e){
        console.log(e);
        alert("Prod added, congrats!");
    };
    
    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}
function showProds(e){
    var transaction = db.transaction(["Produtos"], 'readonly');
    var os = transaction.objectStore("Produtos");
    var index = os.index('prodname');

    var output="";
    
    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;
        
        if(cursor){
            output += "<tr>";
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span class='cursor prod' contenteditable='true'>"+cursor.value.prodname+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true'>"+cursor.value.description+"</span></td>";
            output += "<td class='cursor prod' contenteditable='true'>"+cursor.value.preco+"</td>";
            output += "<td><span class='cursor prod' contenteditable='true'>"+cursor.value.estoque+"</span></td>";
            output += "<td><span class='cursor prod' contenteditable='true'>"+cursor.value.qtdeVendida+"</span></td>";
            output += "<td>"+cursor.value.image+"</td>";
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
