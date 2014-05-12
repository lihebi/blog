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

  // google code prettify
  $('pre').addClass("prettyprint");
  prettyPrint();

  // keymaster
  key('g', function(){
    toggleSidebar();
  });

  // bootstrap table style
  $('table').addClass('table table-striped');
});
