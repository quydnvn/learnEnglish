'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');

Route.on('/').render('welcome')

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
|
*/
Route.group(() => {
  /*
  |--------------------------------------------------------------------------
  | API - Authentication
  |--------------------------------------------------------------------------
  */
  Route.post('/auth/sign-in', 'AuthController.signIn')
  Route.post('/auth/register', 'AuthController.register')
  Route.post('/auth/token/refresh', 'AuthController.refreshToken')
  Route.post('/auth/logout', 'AuthController.logout')

  /*
  |--------------------------------------------------------------------------
  | API - User
  |--------------------------------------------------------------------------
  */
  Route.get('/user/me', 'UserController.getUser')
}).prefix('api/v1')
