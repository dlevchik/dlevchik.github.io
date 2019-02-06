var Animation = function(){
    $('.blogs').find('p').delay(1400).animate({opacity:1, left:0},'slow'); 
    $('.blogs').find('img').delay(2000).animate({opacity:1, right:0},'slow');
    $('.blogs').find('button').delay(2500).animate({opacity:1, bottom:0},'slow');  
  };

  
  if(windowWidth<=549){
    if(windowScrollTop>600){
      $('.clients').css('background','tomato');
  		firstAnimation();
  	}
    if(windowScrollTop>1750){
      $('.process').css('background','tomato');
       secondAnimation();
    }
    if(windowScrollTop>3500){
      $('.blogs').css('background','tomato');
      thirdAnimation();
    }
  }else if(windowWidth>549 && windowWidth<=991){
    if(windowScrollTop>480){
       $('.clients').css('background','tomato');
  		firstAnimation();
  	}if(windowScrollTop>1150){
       $('.process').css('background','tomato');
       secondAnimation();
    }if(windowScrollTop>2200){
       $('.blogs').css('background','tomato');
       thirdAnimation();
    }  
  }else{
     if(windowScrollTop>450){
       $('.clients').css('background','tomato');
  		firstAnimation();
  	}if(windowScrollTop>850){
       $('.process').css('background','tomato');
       secondAnimation();
    }
    if(windowScrollTop>1600){
       $('.blogs').css('background','tomato');
       thirdAnimation();
    }
  };