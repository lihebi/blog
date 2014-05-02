$().ready(function() {
  var openSidebar = function() {
    $('body').addClass('sidebar');
  };
  var closeSidebar = function() {
    $('body').removeClass('sidebar');
  };
  var toggleSidebar = function() {
    if ($('body').hasClass('sidebar')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  $('code').addClass("prettyprint");
  prettyPrint();

  // var mySlidebars = new $.slidebars();
  // $('#slidebar-toggle').on('click', function() {
  //   mySlidebars.toggle('left');
  // });
  alert('before');
  key('g', function(){
    // mySlidebars.toggle('left');
    alert('g');
    toggleSidebar();
  });
  alert('after');
});
