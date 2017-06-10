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
            os.createIndex('preco','idade',{unique:false});
            os.createIndex('image','image',{unique:false});
            os.createIndex('estoque','estoque',{unique:false});
            os.createIndex('image','image',{unique:false});
       }   
    };
});


function addProd(){
    var prodname=$('input[name=produto]').val();
    var description=$('input[name=descricao]').val();
    var preco=$('input[name=preco]');
    var estoque=$('input[name=estoque]')
    var qtdeVendida=$('input[name=vendas]');
    
    var prod={
        prodname:prodname,
        description:description,
        preco:preco,
        estoque:estoque,
        qtdeVendida:qtdeVendida
    }
    
    var transaction=db.transaction(["Prods"],"readwrite");
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
    var transaction = db.transaction(["Animals"], 'readonly');
    var os = transaction.objectStore("Animals");
    var index = os.index('petname');

    var output="";
    
    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;
        
        if(cursor){
            output += "<tr>";
            output += "<td>"+cursor.value.id+"</td>";
            output += "<td><span>"+cursor.value.petname+"</span></td>";
            output += "<td><span>"+cursor.value.raca+"</span></td>";
            output += "<td><span>"+cursor.value.idade+"</span></td>";
            output += "<td>"+cursor.value.image+"</td>";
            output += "<td><a href=''>Delete</a></td>";
            output += "<td><i class=\"material-icons\">delete</i></td>"; 
            
            output += "</tr>";
            cursor.continue();
            
            $('#LPets').html(output);
        }
        
    }
}
