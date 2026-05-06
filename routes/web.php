<?php

use Illuminate\Support\Facades\Route;

// Catch all routes and serve the React SPA
Route::get('/{any}', fn() => view('app'))->where('any', '.*');
