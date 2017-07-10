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
  var animal = $('#delAnimal').val();
  var data = $('#delData').val();
  removerServico(animal, data);
}

function removerServico(animal, data) {
  $.post('http://localhost:3000/removerHorario', {animal, data});
}

function listarHorarios(event) {

  var data = $('#data').text();
  $.post('http://localhost:3000/listHorarios', {data}, response => {
    if(!response)
      alert('Dados não encontrados');
    else {
      console.log(response);
    }
  });
}
