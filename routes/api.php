<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\IssueController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    Route::prefix('issues')->group(function () {
        Route::get('/stats',                    [IssueController::class, 'stats']);
        Route::get('/',                         [IssueController::class, 'index']);
        Route::post('/',                        [IssueController::class, 'store']);
        Route::get('/{issue}',                  [IssueController::class, 'show']);
        Route::patch('/{issue}',               [IssueController::class, 'update']);
        Route::delete('/{issue}',              [IssueController::class, 'destroy']);
        Route::post('/{issue}/regenerate-summary', [IssueController::class, 'regenerateSummary']);
    });
});
