$(document).ready(function(){
    var request=indexedDB.open('Pets',1);

    request.onsuccess=function(e){
        console.log("Success creating database!");
        var db=e.target.result;
        var os=db.createObjectStore('Animals',{keyPath: "ID",autoIncrement: true});
    }

    request.onerror=function(){
        console.log("Messed up on creating database!");
    
    }


    request.onupgradeneeded=function(e){
        var db=e.target.result;
        if(!db.objectStoreNames.contains('Animals')){
            var os=db.createObjectStore('Animals',{keyPath: "ID", autoIncrement: true});

        }
        
    }

});


function addPet(){
    var petname= $('petname').val();
    var raca= $('raca').val();
    var idade= $('idade').val();
    var image= $('image').val();
    
    var transaction = db.transaction(["Animals"], "readwrite");
      
    var store=transaction.objectStore("Animals");

    var animal={
        name: name,
        raca: raca,
        idade: idade,
        image: image
    }

    var request = store.add(animal);
    
    request.onsuccess=function(e){
        alert("Pet Added");
    }
    
    request.onerror=function(){
        alert("Sorry, cannot add your pet at the time");
        conslole.log("Error",e.target.error.target.name);
    
    }
}
