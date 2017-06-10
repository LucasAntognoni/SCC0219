'use strict';

let db;

$(document).ready(() => {
    var request=indexedDB.open('Services',1);

    request.onsuccess=function(e){
       db=e.target.result;
       console.log("Database's up!");
       showPets();
    };

    request.onerror=function(){
        console.log("Messed up on creating database!");
    
    };

    request.onupgradeneeded=function(e){
       db=e.target.result;
       if(!db.objectStoreNames.contains("Servs")){
            var os=db.createObjectStore("Servs",{keyPath: "ID", autoIncrement: true});
            os.createIndex('servname','servname',{unique:false});
            os.createIndex('description', 'description',{unique:false});
            os.createIndex('price','price',{unique:false});
            os.createIndex('image','image',{unique:false});
       }   
    };
});


function addPet(){
    var prodname= $('input[name=prodname]').val();
    var description= $('input[name=description]').val();
    var price= $('input[name=price]').val();
    var image= $('input[name=image]').val();
    
    var Service={
        prodname:prodname,
        description:description,
        price:price,
        image:image
    }
    
    var transaction=db.transaction(["Services"],"readwrite");
    var os=transaction.objectStore("Servs");
    var request=os.add(Pet);

    console.log(request);
    request.onsuccess=function(e){
        console.log(e);
        alert("Service added, congrats!");
    };
    
    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}

function showPets(e){
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
