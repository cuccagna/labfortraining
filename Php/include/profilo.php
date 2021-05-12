<?php
if(session_status ( ) !== PHP_SESSION_ACTIVE){
      session_start();//Se non c'è una sessione già attiva, riprendila o attivane una nuova
   }

   if(isset($_SESSION['isLoggedIn'])){?>
   
      <h2>Dashboard - Benvenuto <?php echo $_SESSION['user']['NomeUtente'];?></h2>   
      <h4>Profilo</h4>
      <table class="table table-bordered">
         <?php foreach($_SESSION['user'] as $key => $value){?>
            <tr>
               <th><?php echo $key?></th>
               <td><?php echo $value?></td>
            </tr>
         <?php
      }
      ?>
         
      </table>
   <?php   
   }

   //header("Location:" . $_SERVER['PHP_SELF'] ."?id=5"); //Sia che c'è una sessione che se non c'è vai alla pagina di login
   ?>