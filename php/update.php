<?php
include "./services/MongoDBConnection.php";
include "./services/MySqlConnection.php";
$bulk = new MongoDB\Driver\BulkWrite;

// DATA FROM POST
$data = $_POST['details'];
// Define the document to be inserted
// Insert the document
$_id=$bulk->insert($data);

// Create MongoDB write concern object
$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
// Execute the bulk write operation
$result = $mongo->executeBulkWrite($mongodb_database.'.'.$mongodb_collection, $bulk,$writeConcern);
$mongoId = (string)$_id;


if ($result->getInsertedCount()==1) {
    

// Prepare the statement
$stmt = mysqli_prepare($conn, "UPDATE users SET MongoDbId=? WHERE username=?");

// Bind parameters to the statement
$username = '20CSR051';
$id = $mongoId;
mysqli_stmt_bind_param($stmt, "ss", $id, $username);

// Execute the statement
if (mysqli_stmt_execute($stmt)) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . mysqli_error($conn);
}

// Close the statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);



} else {
    echo "No documents were inserted\n";
}


?>
