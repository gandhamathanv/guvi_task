<?php
include "./services/MySqlConnection.php";
include "./services/MongoDBConnection.php";
include "./services/Response.php";
include "./services/RedisConnection.php";

function getUserDetails($mongodbId){
    global $mongo,$mongodbDatabase,$mongodbCollection;
    $_id=new MongoDB\BSON\ObjectID($mongodbId); 
    $filter = ['_id' => $_id];

    $options = [];

    $query = new MongoDB\Driver\Query($filter, $options);

    $cursor = $mongo->executeQuery("$mongodbDatabase.$mongodbCollection", $query);

    $document = current($cursor->toArray());

    return $document;
    // sendRespose(200,$document);
}

// DATA FROM POST
$username = $_POST['username'];
$verifyPassword = $_POST['password'];

// REDIS SESSIONS
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://127.0.0.1:6379');

// PREPARING STATEMENT
$loginSql = "SELECT username,password,mongoDbId FROM users WHERE username = ? limit 1";
$loginStmt = mysqli_stmt_init($conn);
if (!mysqli_stmt_prepare($loginStmt, $loginSql)) {
    $response = array(
        'status' => false,
        'message' => 'Statement Failed',
    );
    sendRespose(200, $response);
}

// BININD STATEMENT WITH VALUE
mysqli_stmt_bind_param($loginStmt, "s", $username);

// EXCUTION OF QUERRY
mysqli_stmt_execute($loginStmt);

// BIND STATEMENT WITH VALUE
mysqli_stmt_bind_result($loginStmt, $username, $password, $mongoDbId);
$value = mysqli_stmt_fetch($loginStmt);
if (!$value) {
    $response = array(
        'status' => false,
        'message' => 'Invalid User',
    );
    sendRespose(200, $response);
}
// fetch the results


if (password_verify($verifyPassword, $password)) {
    $session_id = uniqid();
    $userDetails=getUserDetails($mongoDbId);
    $data=array(
        "username"=>$username,
        "mongoDB"=>$mongoDbId,
        "userDetails"=>$userDetails,
    );
    $redis->set("session:$session_id", json_encode($data) );
    $redis->expire("session:$session_id", 10 * 60);
    $response = array(
        'status' => true,
        "test"=> $data,
        'message' => 'Success',
        'session_id' => $session_id,
        'data' => array(
            'username' => $username, 'password' => $password, 'mongoDbId' => $mongoDbId,
        ),
    );

    sendRespose(200, $response);
} else {
    $response = array(
        'status' => false,
        'message' => 'Invalid Password',
    );
    sendRespose(200, $response);
}

mysqli_stmt_close($loginStmt);
mysqli_close($conn);

?>