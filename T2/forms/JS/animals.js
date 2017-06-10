'use strict';

let db;

$(document).ready(() => {
    var request=indexedDB.open('Pets',1);

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
       if(!db.objectStoreNames.contains("Animals")){
            var os=db.createObjectStore("Animals",{keyPath: "ID", autoIncrement: true});
            os.createIndex('petname','petname',{unique:false});
            os.createIndex('raca', 'raca',{unique:false});
            os.createIndex('idade','idade',{unique:false});
            os.createIndex('image','image',{unique:false});
       }   
    };
});


function addPet(){
    var petname= $('#petname').val();
    var raca= $('#raca').val();
    var idade= $('#idade').val();
    var image= $('#image').val();
    
    var Pet={
        petname:petname,
        raca:raca,
        idade:idade,
        image:image
    }
    
    var transaction=db.transaction(["Animals"],"readwrite");
    var os=transaction.objectStore("Animals");
    var request=os.add(Pet);

    console.log(request);
    request.onsuccess=function(e){
        console.log(e);
        alert("Pet added, congrats!");
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
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span>"+cursor.value.petname+"</span></td>";
            output += "<td><span>"+cursor.value.raca+"</span></td>";
            output += "<td><span>"+cursor.value.idade+"</span></td>";
            output += "<td>"+cursor.value.image+"</td>";

            output += "<td><i class=\"material-icons\">delete</i></td>"; 
            
            output += "</tr>";
            cursor.continue();
             
        }
            $('#Lpets').html(output);
    };
    
    index.openCursor().onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}