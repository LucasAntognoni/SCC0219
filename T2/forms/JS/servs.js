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
    var servname= $('input[name=servname]').val();
    var description= $('input[name=description]').val();
    var price= $('input[name=price]').val();
    var image= $('input[name=image]').val();
    
    var Service={
        servname:servname,
        description:description,
        price:price,
        image:image
    }
    console.log('Got your service, bro');
    var transaction=db.transaction(["Servs"],"readwrite");
    var os=transaction.objectStore("Servs");
    var request=os.add(Service);
    
    console.log(request);
    request.onsuccess=function(e){
        console.log(e);
        alert("Service added, congrats!");
    };
    
    request.onerror=function(e){
        alert("I'm sorry Dave, I'm afraid I cannot do that", e.target.error.name);
    };
}

function showServs(e){
    var transaction = db.transaction(["Servs"], 'readonly');
    var os = transaction.objectStore("Servs");
    var index = os.index('servname');
    
    var output="";
    
    index.openCursor().onsuccess =function(e){
        let cursor = e.target.result;
        
        if(cursor){
            output += "<tr>";
            output += "<td>"+cursor.value.ID+"</td>";
            output += "<td><span>"+cursor.value.servname+"</span></td>";
            output += "<td><span>"+cursor.value.description+"</span></td>";
            output += "<td><span>"+cursor.value.price+"</span></td>";
            output += "<td>"+cursor.value.image+"</td>";
            output += "<td><i class=\"material-icons\">delete</i></td>"; 
            
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
