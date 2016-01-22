<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        try {

            if (! $user = app('auth')->user()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (TokenExpiredException $e) {

            return response('Unauthorized.', 401)->json(['token_expired']);

        } catch (TokenInvalidException $e) {

            return response('Unauthorized.', 401)->json(['token_invalid']);

        } catch (JWTException $e) {

            return response('Unauthorized.', 401)->json(['token_absent']);

        }

        return $next($request);
    }
}
