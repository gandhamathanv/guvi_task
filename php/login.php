<?php
include "./services/MySqlConnection.php";
include "./services/Response.php";


// DATA FROM POST
$username = $_POST['username'];
$verifyPassword = $_POST['password'];

// PREPARING STATEMENT
$loginSql = "SELECT username,password,mongoDbId FROM users WHERE username = ?";
$loginStmt = mysqli_stmt_init($conn);
if (!mysqli_stmt_prepare($loginStmt, $loginSql)) {
    $response = array(
        'status' => false,
        'message' => 'Statement Failed'
     );
    sendRespose(200,$response);
}


mysqli_stmt_bind_param($loginStmt, "s", $username);

// execute the query
mysqli_stmt_execute($loginStmt);

// bind the results to variables
mysqli_stmt_bind_result($loginStmt, $username,$password,$mongoDbId);

$value=mysqli_stmt_fetch($loginStmt);
if(!$value){
    $response = array(
        'status' => false,
        'message' => 'Invalid User'
      );
    sendRespose(200,$response);
}
  // fetch the results
  while ($value) {

    if (password_verify($verifyPassword, $password)) {
        $response = array(
            'status' => true,
            'message' => 'Success',
            'encode'=> $values_json = base64_encode( json_encode(array(
              'username'=>$username,'password'=>$password,'mongoDbId'=>$mongoDbId
            ))),
            'data' => array(
                'username'=>$username,'password'=>$password,'mongoDbId'=>$mongoDbId
            )
          );
        sendRespose(200,$response);
    } else {
        $response = array(
            'status' => false,
            'message' => 'Invalid Password'
          );
        sendRespose(200,$response);
    }
    break;
  }
  mysqli_stmt_close($loginStmt);
  mysqli_close($conn);


?>