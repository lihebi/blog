$().ready(function() {
  $('code').addClass("prettyprint");
  prettyPrint();

  var mySlidebars = new $.slidebars();
  $('#slidebar-toggle').on('click', function() {
    mySlidebars.toggle('left');
  });
});
