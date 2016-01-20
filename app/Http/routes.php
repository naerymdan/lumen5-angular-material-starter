<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->post('/users/login', 'LoginController@login');

//protected routes with JWT (must be logged in to access any of these routes)
$app->group(['namespace' => 'App\Http\Controllers', 'middleware' => 'auth'], function () use ($app) {

    $app->get('/sample/protected', 'LoginController@protectedData');

});
