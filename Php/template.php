<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>SPA in PHP con gestione del routing</title>
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
   <link rel="stylesheet" href="./css/registrati.css">


   <!--    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />
 -->
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" crossorigin="anonymous" />

   <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script> -->

   <style>
      header,
      menu,
      #corpo,
      footer {
         padding: 10px;
         margin: 5px auto;
         border: 1px solid #333;
      }

      header {
         height: 80px;
      }

      menu {
         min-height: 30px;
      }

      menu ul {
         margin: 0;
         padding: 0;
         width: 100%;
         list-style: none;
      }

      menu ul li {
         width: 16%;
         float: left;
         text-align: center;
         line-height: 30px;
      }



      footer {
         height: 100px;
      }

      #corpo {
         min-height: 400px;
      }
   </style>
</head>

<body>
   <div class="container">
      <?php
      include "include/header.php";
      include "include/menu.php";
      include "include/corpo.php";
      include "include/footer.php";

      ?>
   </div>
</body>

</html>