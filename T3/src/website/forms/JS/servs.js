'use strict';

let db;

$(document).ready(() => {
    var request=indexedDB.open('Services',1);

    request.onsuccess=function(e){
       db=e.target.result;
       console.log("Database's up!");
       showServs();
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


function addServ(){
    const servname= $('input[name=servname]').val();
    const description= $('input[name=description]').val();
    const price= $('input[name=price]').val();
    const category = 'Service';

    $.post('http://localhost:3000/addService', {servname, description, price, category});
}

function showServs(e){
    var transaction = db.transaction(["Servs"], 'readonly');
    var os = transaction.objectStore("Servs");
    var index = os.index('servname');

    var output="";

    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;

        if(cursor){
            output += "<tr id='serv_"+cursor.value.ID+"'>";
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span class='cursor serv' contenteditable='true' data-field='servname' data-id="+cursor.value.ID+">"+cursor.value.servname+"</span></td>";
            output += "<td><span class='cursor serv' contenteditable='true' data-field='description' data-id="+cursor.value.ID+">"+cursor.value.description+"</span></td>";
            output += "<td><span class='cursor serv' contenteditable='true' data-field='price' data-id="+cursor.value.ID+">"+cursor.value.price+"</span></td>";
            output += "<td>"+cursor.value.image+"</td>";
            output += "<td><a onclick=\"removeServ("+cursor.value.ID+")\" href=\'\'><i class=\"material-icons\" style=\"color: crimson;\">delete</i></a></td>";

            output += "</tr>";
            console.log(cursor);
            cursor.continue();

        }
            $('#LServs').html(output);

    };

    index.openCursor.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}


function clearAllServs(){
    if(confirm("Você tem certeza?")==true){
        $.post('http://localhost:3000/removeAllServices');
    }
}

function removeServ(ID){
    var transaction = db.transaction(["Servs"], 'readwrite');
    var os = transaction.objectStore("Servs");

    var request = os.delete(ID);

    request.onsuccess=function(){
        console.log('Service deleted =/');
        $('#serv_'+ID).remove();

    }

    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}



$('#LServs').on('blur','.serv', function(){
    var newText=$(this).html();
    var field=$(this).data('field');
    var id=$(this).data('id');

    var transaction = db.transaction(["Servs"], 'readwrite');
    var os = transaction.objectStore("Servs");

    var request = os.get(id);

    request.onsuccess=function(){
       var data =  request.result;

       if(field=='servname'){
           data.petname=newText;
       }
       else if(field=='description'){
            data.raca=newText;
       }
       else if(field=='price'){
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
