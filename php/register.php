<?php
include "./services/MySqlConnection.php";


// PREPARING STATEMENT
$insertSql = "INSERT INTO users (username, password, mongoDbId) VALUES (?, ?, ?)";
$insertStmt = mysqli_stmt_init($conn);
if (!mysqli_stmt_prepare($insertStmt, $insertSql)) {
  die("SQL error: " . mysqli_stmt_error($insertStmt));
}

// DATA FROM POST REQUEST
$username = $_POST['username'];
$password = $_POST['password'];
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$mongoDbId =NULL;

// $mongoDB_id = "123456789012345678901234";
mysqli_stmt_bind_param($insertStmt, "sss", $username, $hashedPassword, $mongoDbId);

// // Execute the statement
if (!mysqli_stmt_execute($insertStmt)) {
  die("Execution failed: " . mysqli_stmt_error($insertStmt));
}
else{
    
}
// // Close the statement and connection
mysqli_stmt_close($insertStmt);
mysqli_close($conn);


?>