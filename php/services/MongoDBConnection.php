
<?php

// MONGODB 
$mongodbLink= "mongodb+srv://gandhamathan:Gandha1234@guvi.dsycbkh.mongodb.net/?retryWrites=true&w=majority";
$mongodbDatabase = "guvi";
$mongodbCollection = "guvi";
// CONNECTION
$mongo = new MongoDB\Driver\Manager($mongodbLink);
?>
