<?php
// REDIS
$redisLink='redis-18736.c73.us-east-1-2.ec2.cloud.redislabs.com';
$redisPort=18736;
$redisAuth="vO0v7Zno8sZsUE5PQO0e5UJZLp7YY7W2";
//Connecting to Redis server on localhost
$redis = new Redis();

// $redis->connect('127.0.0.1', 6379);
$redis->connect($redisLink, $redisPort);
$redis->auth($redisAuth);
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://127.0.0.1:6379');

?>