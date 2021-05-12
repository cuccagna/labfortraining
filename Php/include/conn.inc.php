<?php 
   $host = "localhost"; //nome dominio del server
      $db_name = "LabForFood";
      $usr = "root"; //MAI USARE QUESTI USERNAME E PASSWORD IN PRODUZIONE
      $pwd = ""; //oppure root
      $port = 3306; // è la porta di sql

      $dbConn = mysqli_connect($host,$usr,$pwd,$db_name,$port)
      or die("Si è verificato il seguente errore: " . mysqli_connect_error());
?>