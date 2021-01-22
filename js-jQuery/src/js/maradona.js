$(domLoaded);

function domLoaded(){
   let delay=400;
   let animationLogoFinished = false;

   $('header div.maradona-logo-contain span').each(function(i,el){
         $(el).delay(delay).fadeIn(400);
         delay+=800;
      

      if(i===3){
         $('div.maradona-logo-contain').delay(delay).slideUp(1000); 
         $('div.maradona-logo').delay(delay).slideDown(1000,()=>{animationLogoFinished=true;});
      }


   })

   $('div.hamburger-menu').on('click',function(){
      //Se il click sull'hamburger avviene prima che l'animazione del logo sia finita
      // interrompo l'animazione prematuramente
      if(!animationLogoFinished){
         $('div.maradona-logo').show();
         $('div.maradona-logo-contain').hide();
      }
      $('nav.sidebar').show();
      $('nav.sidebar').animate({width:'30%'},'700');
      $('div.arrow-close').show();

      $('header,main').css('opacity','0.4'); //Sarebbe meglio usare una classe per disaccoppiare css e js
   })

   /*Uso Event Delegation*/
   $('nav.sidebar').on('click',function(event){
      $('nav.sidebar').animate({width:'0'},'700',()=>{
         $(this).hide();
      });

      $('header,main').css('opacity','1');

      let target = $(event.target);
      let targetHref = event.target.hash; //In questo caso potrei anche fare target.attr('href');
      
      if(target.is("a")) //l'elemento è un link
      {
         $('html,body').animate({
            scrollTop : $(targetHref).offset().top
         },2000)
      }
      
   })

   $(window).on('scroll resize',function(){

      if($(this).scrollTop() > 700){
         $("div[role='button']").fadeIn();
      }
      else{
         $("div[role='button']").fadeOut();
      }
   })

   $("div[role='button']").on('click',function(){
      $('html,body').animate({scrollTop:0},1000);
   })

}