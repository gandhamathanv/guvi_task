<?php
include "./services/MySqlConnection.php";
include "./services/response.php";

$token = $_GET['token'];

$data=json_decode(base64_decode($token));

sendRespose(200,$data);


?>