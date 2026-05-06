<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Anthropic Claude API
    |--------------------------------------------------------------------------
    |
    | Set ANTHROPIC_API_KEY in your .env to enable AI-generated summaries.
    | If the key is absent the system falls back to rules-based summaries.
    |
    */

    'anthropic' => [
        'key' => env('ANTHROPIC_API_KEY', ''),
    ],

];
