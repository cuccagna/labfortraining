<main id="corpo">
<?php
   /*Costruiamo una procedura di Routing 
   per testare se nell'URL è presente il
   parametro id*/
   if( count($_GET) == 1 && isset($_GET['id'])){
      
      switch($_GET['id']){
         case 0:
            echo "<h1>HOME</h1>";
            break;
         case 1:
            include "chi_siamo.html";
            break;
         case 2:
            include "servizi.html";
            break;
         case 3:
            include "gallery.php";
            break;
         case 4:
            include "contatti.html";
            break;
         case 5:
            include "login.php";
            break;
         case 6:
            include "registrati.php";
            break;
         case 7:
            include "dashboard.php";
            break;
         case 8:
            include "profilo.php";
            break;
         case 9:
            include "logout.php";
            break;
         case 10:
            include "ordini.php";
            break;
         default:
            redirect();
      }
   }
   else if($_GET){//Qui faccio un redirect solo se c'è una query string
      redirect();
   }
   else //è la home e visualizza il suo contenuto
      echo "<h1>HOME</h1>";

   function redirect(){
      header("Location:" . $_SERVER['PHP_SELF'] ."?id=0");
   }
?>
</main>