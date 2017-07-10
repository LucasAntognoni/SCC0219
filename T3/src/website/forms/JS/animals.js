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
    const petname= $('#petname').val();
    const raca= $('#raca').val();
    const idade= $('#idade').val();
    const category = 'Animal';

    $.get('http://localhost:3000/addAnimal', {petname, raca, idade, category});

}

function showPets(e){
    var transaction = db.transaction(["Animals"], 'readonly');
    var os = transaction.objectStore("Animals");
    var index = os.index('petname');

    var output="";

    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;

        if(cursor){
            output += "<tr id='pet_"+cursor.value.ID+"'>";
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span class='cursor pet' contenteditable='true' data-field='petname' data-id="+cursor.value.ID+">"+cursor.value.petname+"</span></td>";
            output += "<td><span class='cursor pet' contenteditable='true' data-field='raca' data-id="+cursor.value.ID+">"+cursor.value.raca+"</span></td>";
            output += "<td><span class='cursor pet' contenteditable='true' data-field='idade' data-id="+cursor.value.ID+">"+cursor.value.idade+"</span></td>";
            output += "<td ><span class='cursor pet' contenteditable='true' data-field='image' data-id="+cursor.value.ID+">"+cursor.value.image+"</span></td>";

            output += "<td><a onclick=\"removePet("+cursor.value.ID+")\" href=\'\'><i class=\"material-icons\" style=\"color: crimson;\">delete</i></a></td>";

            output += "</tr>";
            cursor.continue();

        }
            $('#Lpets').html(output);
    };

    index.openCursor().onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}

function clearAllPets(){
    if(confirm("Você tem certeza?")==true){
        indexedDB.deleteDatabase('Pets');
        alert("Pets excluídos :/")
        window.location.href="showAnimals.html";
    }
}

function removePet(ID){
    var transaction = db.transaction(["Animals"], 'readwrite');
    var os = transaction.objectStore("Animals");

    var request = os.delete(ID);

    request.onsuccess=function(){
        console.log('Pet deleted =/');
        $('#pet_'+ID).remove();

    }

    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}



//Update Pets

$('#Lpets').on('blur','.pet', function(){
    var newText=$(this).html();
    var field=$(this).data('field');
    var id=$(this).data('id');

    var transaction = db.transaction(["Animals"], 'readwrite');
    var os = transaction.objectStore("Animals");

    var request = os.get(id);

    request.onsuccess=function(){
       var data =  request.result;

       if(field=='petname'){
           data.petname=newText;
       }
       else if(field=='raca'){
            data.raca=newText;
       }
       else if(field=='idade'){
            data.idade=newText;
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
