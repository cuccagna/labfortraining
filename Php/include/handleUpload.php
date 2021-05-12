<?php
function handle_upload()
{
   $target_dir = "./img/fotoUploaded/";
   $target_file = basename($_FILES['foto']['name']);
   $target_file_serverPath = $target_dir . $target_file;
   $messageError = "";
   if (is_uploaded_file($_FILES['foto']['tmp_name'])) {
      //Non controllo se il file già esiste perchè lo concatenerò all'id
      if ($_FILES['foto']['size'] > 512000)
         $messageError =  "Il file è troppo grande. Max 500 kbyte";

      $mimeType = mime_content_type($_FILES['foto']['tmp_name']);
      if ($mimeType != "image/png" && $mimeType != "image/jpeg" && $mimeType != "image/gif" && $mimeType != "image/svg")
         $messageError = "Il file non è un'immagine nel formato consentito";
   } else
      $messageError =  "Si è verificato un errore durante l'upload";

   //Entra nell'if se finora non ci sono stati errori e move_uploaded_file torna un errore
   if (!$messageError && !move_uploaded_file($_FILES['foto']['tmp_name'], $target_file_serverPath)) {
      $messageError = "Errore nello spostare il file sul server";
   }

   return $messageError;
}

function isFieldFotoNotValid()
{
   if (isset($_FILES['foto'])) {
      switch ($_FILES['foto']['error']) {
         case 0: //UPLOAD successfull
            return handle_upload();
            break;
         case 4:
            return "Non hai selezionato un file";
            break;
         default:
            return "Si è verificato un errore nell'upload del file";
      }
   } else {
      //In questo caso non è stato selezionato il file, è vuoto
      return "Non hai selezionato un file";
   }
}
