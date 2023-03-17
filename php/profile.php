<?php
include "./services/MongoDBConnection.php";
include "./services/response.php";
include "./services/RedisConnection.php";



$redisId = $_GET['redisID'];

$username = $redis->get("session:$redisId");

$filter = ['username' => $username];

$options = [];

$query = new MongoDB\Driver\Query($filter, $options);

$cursor = $mongo->executeQuery("$mongodb_database.$mongodb_collection", $query);

$document = current($cursor->toArray());
$response = array(
    'status' => true,
    'newUser' => false,
    'userDetails' => $document,
    'username' => $username,

);

if ($document) {
sendRespose(200, $response);
}else {
    sendRespose(200, array(
        'status' => false,
        'message' => 'No documentation',
    ));
}

// if ($data->mongoDbId) {

//     $id = new MongoDB\BSON\ObjectID($data->mongoDbId); // ID object
//     $filter = ['_id' => $id];
//     $options = ['limit' => 1];

//     $query = new MongoDB\Driver\Query($filter, $options);

//     $cursor = $mongo->executeQuery("$mongodb_database.$mongodb_collection", $query);

//     $document = current($cursor->toArray());
//     $response = array(
//         'status' => true,
//         'newUser' => false,
//         'userDetails' => $document,
//         'username' => $data->username,

//     );
//     if ($document) {
//         sendRespose(200, $response);
//     } else {

//         sendRespose(200, array(
//             'status' => false,
//             'message' => 'No documentation',
//         ));
//     }

//     sendRespose(200, $data);
// } else {
//     $response = array(
//         'status' => true,
//         'newUser' => true,
//         'username' => $data->username,
//     );
//     sendRespose(200, $response);
// }
// // echo $data->username;
?>