$(document).ready(function() {

  $('form').hide();

  $('#Consultar').click(function() {
    $('h1, p').hide();
    $('#formBusca').show();
  });

  $('#Adicionar').click(function() {
    $('h1, p').hide();
    $('formPreencher').show();
  });

  $('#Atualizar').click(function() {
    $('h1, p').hide();
    $('#formBusca').show();
  });

  $('#Remover').click(function() {
    $('h1, p').hide();
    $('#formBusca').show();
  });
});

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

$(document).ready(function() {

  var request = indexedDB.open("produtos", 3);

  request.onupgradeneeded = function(event) {
    var db = event.target.result;

    if(!db.objectStoreNames.contains('produtos'))
    {
      var objectStore = db.createObjectStore("produtos", { keyPath: "ID", autoIncrement:true});
      objectStore.createIndex('nome','nome',{unique:false});
      objectStore.createIndex('descricao', 'descricao',{unique:false});
      objectStore.createIndex('foto','foto',{unique:false});
      objectStore.createIndex('preco','preco',{unique:false});
      objectStore.createIndex('estoque','estoque',{unique:false});
    }
  };

  request.onerror = function(event) {
  console.log('Erro: não foi possível conectar ao Banco de Dados...');
  console.log("Erro:", event.target.error.name);
  };

  request.onsuccess = function(event) {
    console.log('Conectado ao Banco de Dados...');
    db = event.target.result;
  };
});

function adicionarProduto() {

  var nome = $('#nome').val();
  var descricao = $('#descricao').val();
  var foto = $('#foto').val();
  var preco = $('#preco').val();
  var estoque = $('#estoque').val();

  var transaction = db.transaction(["produtos"], "readwrite");

  // Request for objectStore
  var store = transaction.objectStore("produtos");

  // Define produtos
  var produto = {
    n:nome,
    d:descricao,
    f:foto,
    p:preco,
    e:estoque
  };

  // Adding entry
  var request = store.add(produto);

  // Error
  request.onerror = function(event) {
    alert("Não foi possível adicionar o produto!");
    console.log("Erro:", event.target.error.name);
  }

  // Success
  request.onsuccess = function(event) {
      alert("Produto adicionado com sucesso!");
      console.log("Produto adicionado com sucesso!");
  }
}
