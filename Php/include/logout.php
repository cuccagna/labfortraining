<?php
if(session_status ( ) !== PHP_SESSION_ACTIVE){
      session_start();//Se non c'è una sessione già attiva, riprendila o attivane una nuova
   }

   if(isset($_SESSION['isLoggedIn'])){
      session_destroy();
   }

   header("Location:" . $_SERVER['PHP_SELF'] ."?id=5"); //Sia che c'è una sessione che se non c'è vai alla pagina di login
   ?>