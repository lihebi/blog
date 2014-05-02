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

  key('g', function(){
    toggleSidebar();
  });

  $('table').addClass('table table-striped');
});
