<?php



// MySQL database information
// MYSQL VARIABLES
$serverName = "database-1.cmo9w5revdy7.ap-northeast-1.rds.amazonaws.com";
$username = "gandhamathan";
$password = "Gandha1234";
$database = "guvi";

// Set up a MySQL database connection
$conn = mysqli_connect($serverName, $username, $password, $database);

// Check if the connection was successful
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

?>
