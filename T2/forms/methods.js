function LoadDb(){
    var request= indexedDB.open("Teste");

    request.onerror=function(event){
        alert("não habilitou o indexedDb, seu jagunço!");
    };
    request.onsuccess=function(event){
        var db=event.target.result;
        var objectStore=db.createObjectStore("Animals",{keyPath: "ID"});
        var transaction=db.transaction(["Animals"], "versionchange");
        
        transaction.onsuccess=function(event){
            console.log("Db created");
            objectStore.createIndex("ID", "ID", {unique: false});
            objectStore.transaction.oncomplete=function(event){
                console.log("ready to receive data;");
            }
        
        }
        
        
    }
}   


function getAnimal(){
       if("indexedDb" in window){
            var k=document.getElementById("pet-form");
            var db=indexedDB.open("Teste");
            var request=db.transaction(["Animals"], "readwrite").objectStore("Animals").add({name:k.item[0],ID: k.item[1], raca:k.item[2],idade:k.item[3],image:data.item[4]});
            request.onsucces=function(event){
                alert("YAY IT WORKED, BITCH!");
            
            };
            request.onerror=function(event){
                alert("Uh-oh...");
            }
            
       }
        
        
        
    };


function getService(){
    if("indexedDb" in window){
        const form=document.getElementById("service-form");
    }
    
}

function getProduct(){
    if("indexedDb" in window){
        const form=document.getElementById("product-form");
    }    
    
}
