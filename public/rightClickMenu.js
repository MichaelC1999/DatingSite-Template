        $(document).bind("contextmenu", function (event) {       
        // Prevent the default COntext Menu from showing
        event.preventDefault();     
        // Show contextmenu to the lower right of the mouse
        var positionOfMenuRelativeToClickPoint = {
            top: event.pageY + "px",
            left: event.pageX + "px"
        }
        $(".custom-menu").finish().toggle(100).css(positionOfMenuRelativeToClickPoint);
    });
    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {      
        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu").length > 0) {           
            // Hide the context Menu
            $(".custom-menu").hide(100);
        }
    });
    // If the menu element is clicked
    $(".custom-menu li").click(function(){
        // This is the triggered action name
        switch($(this).attr("data-action")) {  
            // A case for each function. Your actions here
            case "first": 
                console.log("1");
                console.log("2"); 
                break;
            case "second": 
                alert("second"); 
                break;
        }
        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
      });

    $('#Menu').on( "click", '#button-1', function(e){
        alert('CLICKED 1');
    });

    $('#Menu').on( "click", '#button-2', function(e){
        $('#button-1').trigger('click');
        alert('CLICKED 2');
    });



    $('#tabs li a:not(:first)').addClass('inactive');
    $('.container').hide();
    $('.container:first').show();
        
    $('#tabs li a').click(function(){
        var t = $(this).attr('id');
      if($(this).hasClass('inactive')){ 
        $('#tabs li a').addClass('inactive');           
        $(this).removeClass('inactive');
        
        $('.container').hide();
        $('#'+ t + 'C').fadeIn('slow');
     }
    });




