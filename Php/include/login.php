<?php
//Il doppio if seguente serve per evitare di dovere chiamare
//session_start() senza che ci sia una sessione
//Inoltre non posso usare if(isset($_SESSION['isLoggedIn']))
//da solo perchè serve prima chiamare session_start()
//per fare il "resume" della sessione precedente 
if (session_status() !== PHP_SESSION_ACTIVE) {
   session_start(); //Se non c'è una sessione già attiva, riprendila o attivane una nuova
}

if (isset($_SESSION['isLoggedIn'])) {
   header("Location:" . $_SERVER['PHP_SELF'] . "?id=7");
}

// session_start();
// if(session_status ( ) === PHP_SESSION_ACTIVE && isset($_SESSION['isLoggedIn'])){
//    header("Location:" . $_SERVER['PHP_SELF'] ."?id=7");
// }
?>

<h2>Area riservata</h2>


<?php
//Cioè se è impostata e vera
if (!empty($_SESSION['registration'])) {
?>
   <div class="alert alert-success" role="alert">
      Registrazione avvenuta con successo! Adesso effettua il login.
   </div>
   <?php
}

//8 Serve per consentire un'altra registrazione se vuoi.
unset($_SESSION["secretFormValue"]);
$_SESSION['registration'] = false;

//Se i dato sono stati postati
if ($_POST) {

   //print_r($_POST);

   $patternPassword = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_@#\$%\^&\*])(?=.{8,})/";
   //Verifica se i dati sono passati correttamente

   if (
      !empty($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) &&
      !empty($_POST['password']) && preg_match($patternPassword, $_POST['password']) &&
      isset($_POST['check_1'])
   ) { // Se sei qui validazione lato server ok, fare autenticazione (cioè controllare che la password e l'utente ci sono nel database)
      include "./include/conn.inc.php"; //CONNESSIONE AL DATABASE
      $EmailUtente = $_POST['email'];
      $Password = $_POST['password'];

      $EmailUtente = mysqli_real_escape_string($dbConn, htmlentities($EmailUtente, ENT_NOQUOTES));
      $Password = mysqli_real_escape_string($dbConn, htmlentities($Password, ENT_NOQUOTES));
      //$EmailUtente = addcslashes($EmailUtente , '%_');
      //$Password = addcslashes($Password , '%_');

      //echo "$EmailUtente";
      //echo "$Password";

      $query = "Select * From utenti Where EmailUtente = '$EmailUtente' AND
           Password = sha1('$Password') AND Attivo = 1";

      //echo "$query <br />";
      $result = mysqli_query($dbConn, $query) or die("Query Error");
      //print_r($result);
      //necessario l'if perchè mysqli_query torna true anche in caso la query 
      //non restitusca alcun risultato. Torna false solo in caso di errore di
      //sintassi o connessione al DB.
      if (mysqli_num_rows($result) == 1) {
         //sono autenticato
         $row = mysqli_fetch_assoc($result);
         //print_r($row);

         if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start(); //inizializzo le variabili di sessione
         }
         $_SESSION['isLoggedIn'] = 1;
         $_SESSION['user'] = $row; //memorizzo le informazioni dell'utente

   ?>

         <div class="alert alert-success" role="alert">
            <?php
            echo "Login success! Sarai ridirezionato alla tua area riservata entro 3 secondi";
            ?>
         </div>

         <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
         </div>

         <script>
            //Nota che usare la funzione sleep()  di php non funziona
            setTimeout(() => {
               location.href = "template.php?id=7"
            }, 3000);
            //header("Location:" . $_SERVER['PHP_SELF'] ."?id=7"); //Dashboard
         </script>

      <?php
      } else {
         $errorAuth = "Non sei autenticato <a href='template.php?id=6'>Registrati</a> o riprova"
      ?>
         <div class="alert alert-danger" role="alert">
            <?php
            echo $errorAuth;
            ?>
         </div>
      <?php
      }
   } else { // Se sei qui dati non validi
      $error = "Errore di immissione dati - Riprovare";
      ?>
      <div class="alert alert-danger" role="alert">
         <?php
         echo $error;
         ?>
      </div>

<?php

   }
}
?>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'] ?>?id=5">
   <div class="form-group">
      <label for="email">Email address</label>
      <input type="text" class="form-control" id="email" name="email" placeholder="Enter email">
   </div>
   <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" name="password" placeholder="Password">
   </div>
   <div class="form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" name="check_1">
      <label class="form-check-label" for="exampleCheck1">Ho letto <a href="https://www.labfortraining.it/labfortraining-privacy" target="_blank">l'informativa sulla privacy</a> e accetto le condizioni</label>
   </div>
   <button type="submit" class="btn btn-primary">Submit</button>
</form>

<div class="form-group">
   <span>
      Non hai un account? <a href="<?php echo $_SERVER['PHP_SELF'] ?>?id=6">Registrati</a>
   </span>
</div>