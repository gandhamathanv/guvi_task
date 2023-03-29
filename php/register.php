<?php
include "./services/MySqlConnection.php";
include "./services/MongoDBConnection.php";
include "./services/RedisConnection.php";
include "./services/Response.php";


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
function CreateUser($username, $password,$insertStmt,$data){

  global $mongo,$mongodbCollection,$mongodbDatabase,$redis;
  $bulk = new MongoDB\Driver\BulkWrite;
  $_id = $bulk->insert($data);
  // Create MongoDB write concern object
  $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
  // Execute the bulk write operation
  $result = $mongo->executeBulkWrite($mongodbDatabase . '.' . $mongodbCollection, $bulk, $writeConcern);
  $mongoDbId = (string)$_id;
  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
  
  mysqli_stmt_bind_param($insertStmt, "sss", $username, $hashedPassword, $mongoDbId);

  // Execute the statement
  if (!mysqli_stmt_execute($insertStmt)) {
    die("Execution failed: " . mysqli_stmt_error($insertStmt));
  }
  else{
    // CACHE HIT
    // REDIS SESSIONS
    // REDIS SESSION ID AND TIME
    $session_id = uniqid();
    $userDetails=getUserDetails($mongoDbId);
    $data=array(
        "username"=>$username,
        "mongoDB"=>$mongoDbId,
        "userDetails"=>$userDetails,
    );
    $redis->set("session:$session_id", json_encode($data) );
    $redis->expire("session:$session_id", 10 * 60);
    // RESPONSE
    $response = array(
        'status' => true,
        'message' => 'Success',
        'session_id' => $session_id,
        'data' => array(
            'username' => $username, 'password' => $password, 'mongoDbId' => $mongoDbId,
        ),
    );
    sendRespose(200,$response);
  }
}
function UpdateUser($username,$data,$redisId){
  global $redis,$mongodbDatabase,$mongodbCollection;

  $sessionDetails =json_decode($redis->get("session:$redisId"));
  global $mongo,$mongodbDatabase,$mongodbCollection;
  $bulk = new MongoDB\Driver\BulkWrite;
  $bulk->update(['username' => $username], $data);
  $result = $mongo->executeBulkWrite($mongodbDatabase . '.' . $mongodbCollection, $bulk);
  $response=array();

  if ($result->getModifiedCount() > 0) {
    $response['status'] = true;
    $response['message'] = "Updated";
    $newData=getUserDetails($sessionDetails->mongoDB);
    $sessionDetails->userDetails =$newData;
    $redis->set("session:$redisId", json_encode($sessionDetails));
    $redis->expire("session:$redisId", 10 * 60);
  } else {
    $response['status'] = false;
    $response['message'] = "Not Updated";
  }

  sendRespose(200,$response);
}

if(isset($_POST["action"]) && $_POST["action"]=="create"){

  // DATA FROM POST REQUEST
  $username = $_POST['username'];
  $password = $_POST['password'];


  // PREPARING STATEMENT
  $insertSql = "INSERT INTO users (username, password, mongoDbId) VALUES (?, ?, ?)";
  $insertStmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($insertStmt, $insertSql)) {
    die("SQL error: " . mysqli_stmt_error($insertStmt));
  }
  // BASE MONGO DB
  $data= array('username' => $username); 

  CreateUser($username, $password,$insertStmt,$data);
  return;
}else if(isset($_POST["action"]) && $_POST["action"]=="update"){
  // DATA FROM POST
  $data = $_POST['details'];
  $username = $_POST['username'];
  $redisId=$_POST['redisID'];
  UpdateUser($username,$data,$redisId);
}
?>