$(document).ready(function() {

  $('table, button, #formAgenda, #formDeletar').hide();

  $( '#calendario' ).datepicker({
    onSelect: function (date) {
      $('h1, p').hide();
      $('table, button').show();
      $('#data').html(date);
      listarHorarios();
    }
  });

  $('#Agendar').click(function() {
    $('#slots').hide();
    $('#formAgenda').show();
  });

  $('#Deletar').click(function() {
    $('#slots').hide();
    $('#formDeletar').show();
  });
});

function agendarServico() {

  var servico = $('#servico').val();
  var animal = $('#animal').val();
  var cliente = $('#cliente').val();
  var data = $('#data').text();

  $.post('http://localhost:3000/addHorario', {servico, animal, cliente, data});
}


function chamarFuncao() {

  var aninal = $('#delAnimal').val();
  removerServico(animal);
}

function removerServico(animal) {

    var transaction = db.transaction(["agenda"], 'readwrite');
    var objectStore = transaction.objectStore("agenda");

    var objectStoreRequest = objectStore.delete(animal);

    request.onerror=function(event){
      alert("Não foi possível remover o horário!");
      console.log("Erro:", event.target.error.name);
    };

    request.onsuccess=function(){
        alert('Horário removido com sucesso!');
    }
    listarHorarios();
}

function listarHorarios(event) {

  var transaction = db.transaction(["agenda"], 'readonly');
  var os = transaction.objectStore("agenda");
  var index = os.index('data');
  var d = $('#data').text();

  var table = document.getElementById("#slots");
  var row;
  var col;
  var i = 0;
  var output = "";

  index.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if(cursor){

      if(cursor.value.data == d)
      {
        row = table.rows[i];
        col = row.cells[1];

        output += cursor.value.servico;
        output += cursor.value.animal;
        output += cursor.value.cliente;

        $(col).html(output);

        i += 1;
      }
      cursor.continue();
    }

    index.openCursor().onerror = function(event){
        console.log("Error:", e.target.error.name);
    };
  }
}
