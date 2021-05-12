<?php
//print_r($_SESSION);
//Controllo che c'è una sessione attiva 
if (session_status() !== PHP_SESSION_ACTIVE) {
   session_start(); //Se non c'è una sessione già attiva, riprendila o attivane una nuova
}
if (isset($_SESSION['isLoggedIn'])) {
?>
   <h2>Dashboard - Benvenuto <?php echo $_SESSION['user']['NomeUtente']; ?></h2>
   <h4><a href="<?php echo $_SERVER['PHP_SELF'] . '?id=8' ?>">Profilo</a></h4>
   <h4> <a href="<?php echo $_SERVER['PHP_SELF'] . '?id=10' ?>">Ordini</a></h4>
   <h4> <a href="<?php echo $_SERVER['PHP_SELF'] . '?id=9' ?>">Logout</a></h4>

<?php
} else {
   header("Location:" . $_SERVER['PHP_SELF'] . "?id=0");
}
?>