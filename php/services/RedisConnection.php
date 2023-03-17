<?php
//Connecting to Redis server on localhost
$redis = new Redis();
// $redis->connect('127.0.0.1', 6379);
$redis->connect('redis-18736.c73.us-east-1-2.ec2.cloud.redislabs.com', 18736);
$redis->auth("vO0v7Zno8sZsUE5PQO0e5UJZLp7YY7W2");

?>