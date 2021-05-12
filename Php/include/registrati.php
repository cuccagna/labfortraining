<style>
  .registrati {
    display: flex;
    flex-direction: column;
  }


  #corpo .foto figure {
    border: 1px solid #ccc;
    width: 200px;
    height: 200px;
    margin-bottom: auto;
    display: none;
  }

  #corpo .foto figure.visible {
    display: block;
  }

  #corpo .foto figure img {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }

  input[type="file"] {
    display: none;
  }

  /*Per personalizzare <input type="file">*/
  .custom-file-upload {
    margin-top: 8px;
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    box-shadow: 0 0.25em 0 1px #0069d9, inset 0 1px 0 #0069d9;
    border-radius: 5px;
    margin-bottom: auto;
    transition: all 150ms;
    /* align-self: center; */
    /*Per centrarlo verticalmente*/
  }



  .custom-file-upload:hover {
    background-color: #0069d95e;
  }

  .custom-file-upload:active {
    box-shadow: 0 0 0 #0069d9, inset 0 1px 0 #0069d9;
    transform: translateY(.25em);
    background-color: #fff;
  }
</style>
<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start(); //Se non c'è una sessione già attiva, riprendila o attivane una nuova
}

if (isset($_SESSION['isLoggedIn'])) {
  header("Location:" . $_SERVER['PHP_SELF'] . "?id=7"); //Vai alla dashboard
}


if (!empty($_SESSION['registration'])) {
  header("Location:" . $_SERVER['PHP_SELF'] . "?id=5"); //Vai al login
}

// 1 generate some unique session value
$_SESSION['secretFormValue'] = isset($_SESSION["secretFormValue"]) ? $_SESSION["secretFormValue"] : md5(microtime());
// Variabile che serve per memorizzare il token della prima richiesta con successo.
$secretFormValue;
unset($secretFormValue);

$patternEmail = "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i";

//Il pattern deve essere lo stesso di quello usato nel login
$patternPass = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_@#\$%\^&\*])(?=.{8,})/";
//$patternPass = "/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/";

$errorNome = "";

$errorCognome = "";

$errorEmail = "";

$errorPassword = "";

$errorRipetiPassword = "";

$errorFoto = "";

$errorCheck = "";

$errorMessage = 0; //all'inizio c'è errore perchè i campi sono tutti vuoti

$patterns = array("password" => $patternPass, "ripetiPassword" => $patternPass, "email" => $patternEmail);

function isFieldNotValid($field_name)
{
  global $patterns;

  $isNotValid = $isEmpty = empty($_POST[$field_name]);
  if (isset($patterns[$field_name]))
    $isNotValid = $isEmpty || !preg_match($patterns[$field_name], $_POST[$field_name]);

  return $isNotValid;
}

function setError(&$errorField, $fieldMessage)
{
  global $errorMessage;
  $errorField = "Il campo " . $fieldMessage . " non è valido";
  $errorMessage = 1;
}

//Se hai fatto il submit
if ($_POST) {

  //check dati
  //print_r($_POST);

  //NOME
  if (isFieldNotValid('nome'))
    setError($errorNome, 'NOME');

  //COGNOME
  if (isFieldNotValid('cognome'))
    setError($errorCognome, 'COGNOME');

  //EMAIL
  if (isFieldNotValid('email'))
    setError($errorEmail, 'EMAIL');

  //Password
  if (isFieldNotValid('password'))
    setError($errorPassword, 'PASSWORD');

  //RIPETI  PASSWORD
  if (isFieldNotValid('ripetiPassword'))
    setError($errorRipetiPassword, 'RIPETI PASSWORD');


  //PASSWORD e RIPETI PASSWORD NON SONO UGUALI
  if ($_POST['ripetiPassword'] !== $_POST['password']) {

    $errorMessage = 1;
    $errorRipetiPassword = "Il campo RIPETI PASSWORD deve essere uguale al campo PASSWORD";
  }

  include "include/handleUpload.php";
  if ($errMessageFoto = isFieldFotoNotValid()) {
    $errorFoto = $errMessageFoto;
    $errorMessage = 1;
  }

  // CHECK PRIVACY
  if (!isset($_POST['check_1'])) {

    $errorMessage = 1;
    $errorCheck = "Il campo PRIVACY deve essere selezionato";
  }


  //Se entri nell if c'è stata la POST e non ci sono stati errori
  if ($errorMessage == 0) {

    //echo "error: " . $errorMessage;

    // 2 assign submitted **secretFormValue** from your form to a local variable
    $secretFormValue = isset($_POST["secretFormValue"]) ? filter_var($_POST["secretFormValue"], FILTER_SANITIZE_STRING) : '';
    // 3 Per qualche motivo non c'è il campo hidden, qualche hacker lo ha tolto
    if ($secretFormValue === '') {
      error_success_display("La tua pagina è corrotta - Contattare l'amministratore del sito", "alert-danger");
      exit();
    }

    // 4 check if both values are the same
    //4 Nota che il valore di $secretFormValue è quello preso dalla POST
    if ($_SESSION["secretFormValue"] === $secretFormValue) {
      //5
      unset($_SESSION["secretFormValue"]);

      //scrittura del nuovo utente nel DB

      include "./include/conn.inc.php"; //=> $dbh come variabile di connessione

      $NomeUtente = $_POST['nome'];

      $CognomeUtente = $_POST['cognome'];

      $EmailUtente = $_POST['email'];

      //controllo se l'email è già presente => per gli studenti

      $PSWd = $_POST['password'];
      $ImageName = basename($_FILES['foto']['name']);

      $NomeUtente = mysqli_real_escape_string($dbConn, htmlentities($NomeUtente, ENT_NOQUOTES));
      $CognomeUtente = mysqli_real_escape_string($dbConn, htmlentities($CognomeUtente, ENT_NOQUOTES));
      $EmailUtente = mysqli_real_escape_string($dbConn, htmlentities($EmailUtente, ENT_NOQUOTES));
      $PSWd = mysqli_real_escape_string($dbConn, htmlentities($PSWd, ENT_NOQUOTES));
      $ImageNameEncoded = mysqli_real_escape_string($dbConn, htmlentities($ImageName, ENT_NOQUOTES));


      $query = "Insert into utenti(NomeUtente,CognomeUtente,EmailUtente,Password)";

      $query .= " Values('$NomeUtente', '$CognomeUtente', '$EmailUtente', sha1('$PSWd'))";



      //echo $query; //die();

      if (mysqli_query($dbConn, $query)) {

        $query2 = "Select ID_UTENTE From utenti where EmailUtente = '$EmailUtente'";
        $result = mysqli_query($dbConn, $query2);
        if ($result && mysqli_num_rows($result) === 1) {
          $row = mysqli_fetch_assoc($result);
          $idRegistrazione = $row['ID_UTENTE'];

          $newNameImageEncoded = $idRegistrazione . $ImageNameEncoded;
          $newNameImage = $idRegistrazione . $ImageName;
          $query3 = "Update utenti Set ImageName = '$newNameImageEncoded' where ID_UTENTE='$idRegistrazione'";
          if (mysqli_query($dbConn, $query3)) {
            rename("./img/fotoUploaded/" . $ImageName, "./img/fotoUploaded/" . $newNameImage);
          } else {
            unlink("./img/fotoUploaded/" . $ImageName);
            error_success_display("Errore di registrazione nella creazione del nuovo utente", "alert-danger");
            exit();
          }
        } else {
          unlink("./img/fotoUploaded/" . $ImageName);
          error_success_display("Errore di registrazione nella creazione del nuovo utente", "alert-danger");
          exit();
        }
        //Debbo inviare un'email all'utente tramite la funzione mail

        //header("location:http://l4com.labforweb.it/backend/web/index.php?r=user/mail");

        //$_POST=[];

        error_success_display("Nuovo record creato con successo. Sarai ridirezionato alla pagina di Login tra qualche secondo. ", "alert-success");



        /* pER EVITARE che avvengano due submit consecutivi è bene 
              che il redirect venga fatto subito senza il timeout 
       <script type="text/javascript">

                 setTimeout(

                   ()=>{

                     location.href="template.php?id=5"

                   },1000

                 )

               </script>  */

        //In realtà prima di loggarlo dovrei inviargli un'email di conferma
        //Qui semplifico
        if (session_status() !== PHP_SESSION_ACTIVE) {
          session_start(); //Se non c'è una sessione già attiva, riprendila o attivane una nuova
        }


        $_SESSION['registration'] = true;
        header('Location:' . $_SERVER['PHP_SELF'] . "?id=5");
      } else {
        unlink("/img/fotoUploaded/" . $ImageName);
        error_success_display("Errore: " . mysqli_error($dbConn), "alert-danger");
      }
    } //6 Chiusura controllo token uguali
    else { //7 Token non uguali
      error_success_display("Richiesta duplicata. ", "alert-danger");
    }
  } else { //Qui se message_error = 1, cioè c'è un errore in almeno un campo
    error_success_display("Errore di immissione dati - Riprovare", "alert-danger");
  }
}

function error_success_display($message, $alert_type)
{
?>
  <div class="alert <?PHP echo $alert_type; ?>" role="alert">

    <?PHP
    echo $message;
    if ($alert_type === "alert-success") {
    ?>
      <a href="template.php?id=5">Effetua il Login</a>
    <?PHP
    }
    ?>

  </div>
<?PHP
}
?>


<form method="post" name="registrazione" enctype="multipart/form-data" action="<?PHP echo $_SERVER['PHP_SELF']; ?>?id=6">

  <div class="form-row">

    <div class="form-group col-md-6">

      <label for="nome">Nome</label>
      <input type="text" class="form-control <?php if ($errorNome) echo 'error'; ?>" id="nome" name="nome" placeholder="Nome" <?php if (!empty($_POST['nome']) && !$errorNome) { ?> value="<?php echo $_POST['nome']; ?>" <?php
                                                                                                                                                                                                                        } ?>><!-- chiude l'input tag -->
      <span class='testoRosso'><small><?php echo $errorNome; ?></small></span>
    </div>



    <div class="form-group col-md-6">

      <label for="cognome">Cognome</label>

      <?PHP if ($errorCognome) { ?>

        <input type="text" class="form-control error" id="cognome" name="cognome" placeholder="Cognome">

        <span class='testoRosso'><small><?php echo $errorCognome; ?></small></span>

      <?php } else { ?>

        <?php

        if (empty($_POST['cognome'])) { ?>

          <input type="text" class="form-control" id="cognome" name="cognome" placeholder="Cognome">

        <?php } else { ?>

          <input type="text" class="form-control" id="cognome" name="cognome" placeholder="Cognome" value="<?php echo $_POST['cognome']; ?>">

        <?php } ?>

      <?php } ?>

    </div>



  </div>

  <div class="form-row">

    <div class="form-group col-md-6">

      <label for="EMAIL">Email</label>

      <?PHP if ($errorEmail) { ?>

        <input type="text" class="form-control error" id="email" name="email" placeholder="Email">

        <span class='testoRosso'><small><?php echo $errorEmail; ?></small></span>

      <?php } else { ?>

        <?php

        if (empty($_POST['email'])) { ?>

          <input type="text" class="form-control" id="email" name="email" placeholder="Email">

        <?php } else { ?>

          <input type="text" class="form-control" id="email" name="email" placeholder="Email" value="<?php echo $_POST['email']; ?>">

        <?php } ?>

      <?php } ?>

    </div>



  </div>



  <div class="form-row">

    <div class="form-group col-md-6">

      <label for="password">Password</label>

      <?PHP if ($errorPassword) {

      ?>

        <input type="password" class="form-control error" id="password" name="password" placeholder="Password">

        <span class='testoRosso'><small><?php echo $errorPassword; ?></small></span>

      <?php } else { ?>

        <?php

        if (empty($_POST['password'])) { ?>

          <input type="password" class="form-control" id="password" name="password" placeholder="Password">

        <?php } else { ?>

          <input type="password" class="form-control" id="password" name="password" placeholder="Password" value="<?php echo $_POST['password']; ?>">

        <?php } ?>



      <?php } ?>

    </div>



    <div class="form-group col-md-6">

      <label for="ripetipassword">Ripeti Password</label>

      <?PHP if ($errorRipetiPassword) {

      ?>

        <input type="password" class="form-control error" id="ripetiPassword" name="ripetiPassword" placeholder="Ripeti Password">

        <span class='testoRosso'><small><?php echo $errorRipetiPassword; ?></small></span>

      <?php } else { ?>



        <?php

        if (empty($_POST['ripetiPassword'])) { ?>

          <input type="password" class="form-control" id="ripetiPassword" name="ripetiPassword" placeholder="Ripeti Password">

        <?php } else { ?>

          <input type="password" class="form-control" id="ripetiPassword" name="ripetiPassword" placeholder="Ripeti Password" value="<?php echo $_POST['ripetiPassword']; ?>">

        <?php } ?>

      <?php } ?>

    </div>

  </div>

  <div class="form-row">
    <div class="form-group col-md-6 registrati">

      <div id="foto-label">Foto personale (max 500 Kbyte)</div>
      <label for="foto" class="custom-file-upload <?php if ($errorFoto || $errorMessage) echo 'error'; ?>">
        <input type="file" id="foto" name="foto" accept="image/png,image/gif,image/jpeg,image/svg">
        <i class="fa fa-cloud-upload"></i> Carica una tua foto
      </label>
      <span class='testoRosso'><small><?php
                                      if ($errorMessage && !$errorFoto)
                                        echo "Ricaricare la foto";

                                      echo $errorFoto;
                                      ?></small></span>

    </div>
  </div>

  <div class="form-row">
    <div class="form-group col-md-6 registrati foto">
      <figure>
        <img src="" title="Foto personale" alt="foto personale">
      </figure>
    </div>

  </div>


  <div class="form-check">

    <?PHP if ($errorCheck) {

      //echo $errorCheck;

    ?>

      <input type="checkbox" class="form-check-input" id="check_1" name="check_1">

      <label class="form-check-label" for="check_1">Ho letto

        <a href="https://www.labfortraining.it/labfortraining-privacy" target="_blank">l'informativa sulla privacy</a>

        e accetto le condizioni</label>

      <div><span class='testoRosso'><small><?php echo $errorCheck; ?></small></span></div>



      <?php } else {



      if (!empty($_POST['check_1'])) { ?>

        <input type="checkbox" checked class="form-check-input" id="check_1" name="check_1">

        <label class="form-check-label" for="check_1">Ho letto

          <a href="https://www.labfortraining.it/labfortraining-privacy" target="_blank">l'informativa sulla privacy</a>

          e accetto le condizioni</label>



      <?php
      } else {
      ?>



        <input type="checkbox" class="form-check-input" id="check_1" name="check_1">

        <label class="form-check-label" for="check_1">Ho letto

          <a href="https://www.labfortraining.it/labfortraining-privacy" target="_blank">l'informativa sulla privacy</a>

          e accetto le condizioni</label>



    <?php }
    }
    ?>
  </div>
  <!-- 7 -->
  <input type="hidden" name="secretFormValue" value="<?php
                                                      if (isset($secretFormValue))
                                                        echo $secretFormValue;
                                                      else if (isset($_SESSION['secretFormValue'])) {
                                                        $secretFormValue = $_SESSION['secretFormValue'];
                                                        echo $_SESSION['secretFormValue'];
                                                      } else if (isset($_POST['secretFormValue'])) {
                                                        echo $_POST['secretFormValue'];
                                                      }
                                                      ?>">
  <button type="submit" name="btnSubmit" class="btn btn-primary">Invia</button>

</form>



<div class="form-group">

  Hai già un account? <a href="template.php?id=5">Accedi</a>

</div>

<!-- <script>
     let registrationForm = document.forms["registrazione"];
     registrationForm.addEventListener("submit", () => {
       let buttonSubmit = registrationForm.elements['submit'];
       buttonSubmit.disabled = true;
       //parte comunque il submit automaticamente
     })
   </script> -->

<script src="./js/registrati.js"></script>