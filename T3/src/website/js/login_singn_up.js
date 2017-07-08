'use strict';

let db;

$(document).ready(() => {
    // Open database
    const request = indexedDB.open('customermanager', 1);

    request.onupgradeneeded = function(e) {
        db = e.target.result;

        if(!db.objectStoreNames.contains('customers')) {
            const os = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});
            os.createIndex('name', 'name', {unique: false});
        }
    }

    request.onsuccess = function(e) {
        console.log('Success: Opened Database.');
        db = e.target.result;
        showCustomers();
    }

    // Error
    request.onerror = function(e) {
        console.log('Error on connection:', e);
    }
});

function addCustomer() {
    const name = $('input[name=name]').val();
    const phone = $('input[name=phone]').val();
    const address = $('input[name=address]').val();
    const email = $('input[name=email]').val();
    const psw = $('input[name=psw]').val();
    const psw_repeat = $('input[name=psw-repeat]').val();

    if(psw === psw_repeat) {
        const transaction = db.transaction(['customers'], 'readwrite');
        // Ask for ObjectStore
        const store = transaction.objectStore('customers');

        // Define Customer
        const customer = {
            name,
            phone,
            address,
            email,
            psw
        };

        // Performe the Add
        const request = store.add(customer);

        // Sucess
        request.onsuccess = function(e) {
            alert('cadastrado');
            window.location.href="../index.html";
        }

        // Error
        request.onerror = function(e) {
            alert('Error ao cadastrar usuário.');
            console.log('Error:', e.target.error.name);
        }
    }

    else
        alert('Senhas diferentes!');    
}

function showCustomers(e) {
    const transaction = db.transaction(['customers'], 'readonly');
    const store = transaction.objectStore('customers');
    const index = store.index('name');
    let output = '';

    index.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        if(cursor) {
            output += '<tr>';
            output += '<td>'+cursor.value.id+'</td>';
            output += '<td><span>'+cursor.value.name+'</span></td>';
            output += '<td><span>'+cursor.value.email+'</span></td>';
            output += "<td><a href=''>Delete</a></td>";
            output += '</tr>';
            cursor.continue();
        }
        $('#customers').html(output);
    }    
}

function loginCustomer(e) {
    const transaction = db.transaction(['customers'], 'readonly');
    const store = transaction.objectStore('customers');
    const index = store.index('name');

    const uname = $('input[name=uname]').val();
    const psw = $('input[name=psw]').val();
    

    index.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        if(cursor) {
            if(cursor.value.email == uname && cursor.value.psw == psw) {
                window.location.href="../index.html";
                alert('Usuário conectado');
            }

            else
                alert('Senha ou usuário inválidos');
        }

        else
            alert('Erro no servidor');
    }    
}
