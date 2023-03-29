<?php
include "./services/MongoDBConnection.php";
include "./services/response.php";
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

if(!isset($_GET['redisID'])){
    $response=array("status"=>false,"message"=>"Redis ID Not Found");
}
$redisId = $_GET['redisID'];
$sessionDetails =json_decode($redis->get("session:$redisId"));
if(!$sessionDetails){
    // CACHE MISS
    $response= array(
        'status' => false,
        'message' => 'Invalid Session ID',
    );
    sendRespose(200,$response);

}
// sendRespose(200,$sessionDetails);
if(isset($_GET["action"]) && $_GET["action"]=="getUserDetails"){
    $response=array("status"=>true ,"userDetails" => $sessionDetails->userDetails);
    sendRespose(200,$response);
}else if(isset($_GET["action"]) && $_GET["action"]=="logout"){
    $redis->del("session:$redisId");
    $response = array(
        "status" => true,
        "message" => "Logout successful",
    );
    sendRespose(200,$response);    
}
