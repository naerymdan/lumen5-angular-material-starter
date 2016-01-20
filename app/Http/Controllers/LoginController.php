<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LoginController extends Controller
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory $auth
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (! $token = $this->auth->attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
            }
        } catch (Exception $e) {
            // something went wrong
            return response()->json(['error' => 'Could not create token'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['token' => $token]);
    }

    public function protectedData()
    {
        return response()->json(['sample', 'of', 'jwt', 'protected', 'data', '[', 'response', 'from', 'API', ']']);
    }
}
