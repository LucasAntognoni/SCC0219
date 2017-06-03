$(function() {
  $("table").hide();
  $( "#calendario" ).datepicker({
    onSelect: function (date) {
      $("h1, p").hide();
      $("table").show();
      $("#data").html(date);
    }
  });

});
