<?php

namespace Database\Seeders;

use App\Models\Issue;
use App\Services\EscalationService;
use Illuminate\Database\Seeder;

class IssueSeeder extends Seeder
{
    public function run(): void
    {
        $escalation = new EscalationService();

        $issues = [
            [
                'title'            => 'Production database connection pool exhausted',
                'description'      => 'The primary PostgreSQL connection pool is hitting the 200 connection limit during peak hours (09:00–11:00 UTC). API response times are spiking to 8s+ and we are seeing intermittent 503 errors. Started after the v2.4.1 deploy yesterday. PgBouncer metrics show idle connections are not being released.',
                'priority'         => 'critical',
                'category'         => 'infrastructure',
                'status'           => 'in_progress',
                'reporter_name'    => 'Maria Santos',
                'reporter_email'   => 'maria@example.com',
                'ai_summary'       => 'Connection pool exhaustion on primary DB causing 503s since v2.4.1 deploy.',
                'suggested_action' => 'Roll back v2.4.1 immediately and review connection leak introduced in the new ORM migration.',
            ],
            [
                'title'            => 'User authentication tokens not expiring correctly',
                'description'      => 'JWT tokens issued before March 15 appear to remain valid beyond their 24-hour expiry window. Security audit flagged 47 sessions that should have expired. This is a potential authentication bypass vulnerability.',
                'priority'         => 'critical',
                'category'         => 'security',
                'status'           => 'open',
                'reporter_name'    => 'Jake Reyes',
                'reporter_email'   => 'jake.sec@example.com',
                'ai_summary'       => 'JWT tokens issued before March 15 are not expiring, creating a potential auth bypass for 47 sessions.',
                'suggested_action' => 'Invalidate all pre-March-15 tokens server-side immediately, then audit the token refresh logic.',
            ],
            [
                'title'            => 'Dashboard chart renders blank on Safari 17',
                'description'      => 'The revenue breakdown chart on the main dashboard does not render in Safari 17.x. The canvas element is present in the DOM but no data is drawn. Works fine in Chrome and Firefox. Affects approximately 15% of our users. Error in console: "CanvasRenderingContext2D is null".',
                'priority'         => 'high',
                'category'         => 'bug',
                'status'           => 'open',
                'reporter_name'    => 'Ana Cruz',
                'reporter_email'   => 'ana@example.com',
                'ai_summary'       => 'Revenue chart fails to render in Safari 17 due to a null canvas context, affecting 15% of users.',
                'suggested_action' => 'Reproduce on Safari 17, check for cross-origin canvas restrictions, and add a browser compatibility polyfill.',
            ],
            [
                'title'            => 'Add bulk export to CSV for reports module',
                'description'      => 'Operations team needs to export filtered report results to CSV for offline analysis. Currently they must export page by page (100 rows max). We have up to 50,000 rows per report. This is blocking the monthly finance reconciliation process.',
                'priority'         => 'high',
                'category'         => 'feature',
                'status'           => 'open',
                'reporter_name'    => 'Carlos Tan',
                'reporter_email'   => 'carlos@example.com',
                'ai_summary'       => 'Reports module lacks bulk CSV export, blocking monthly finance reconciliation for up to 50k-row datasets.',
                'suggested_action' => 'Implement a queued export job that streams rows to a temp file and emails a download link on completion.',
            ],
            [
                'title'            => 'Search API p99 latency increased from 200ms to 1.4s',
                'description'      => 'Since Monday\'s Elasticsearch index rebuild, the /api/search endpoint p99 latency has gone from 200ms to 1.4s. p50 is fine at 120ms. Datadog shows the slow tail is concentrated on queries with more than 3 filter facets. Index mapping looks unchanged.',
                'priority'         => 'high',
                'category'         => 'performance',
                'status'           => 'open',
                'reporter_name'    => 'Lena Park',
                'reporter_email'   => 'lena@example.com',
                'ai_summary'       => 'Search p99 latency spiked to 1.4s after index rebuild, specifically on multi-facet queries.',
                'suggested_action' => 'Run an Elasticsearch slow query log on multi-facet queries and check if filter aggregation cardinality increased post-rebuild.',
            ],
            [
                'title'            => 'Email notifications sending duplicate messages',
                'description'      => 'Several customers reported receiving the same order confirmation email 2–3 times. The issue appears to affect orders placed between 14:00 and 17:00 UTC on weekdays. Our queue worker logs show the job being picked up multiple times despite an at-most-once delivery configuration.',
                'priority'         => 'medium',
                'category'         => 'bug',
                'status'           => 'open',
                'reporter_name'    => 'Tom Navarro',
                'reporter_email'   => 'tom@example.com',
                'ai_summary'       => 'Order confirmation emails duplicating 2–3x for orders placed on weekday afternoons due to queue worker overlap.',
                'suggested_action' => 'Add an idempotency key to the email job and investigate why the queue worker is picking up already-processed jobs.',
            ],
            [
                'title'            => 'Implement dark mode across the app',
                'description'      => 'Multiple users have requested dark mode support. Our design system uses CSS custom properties so the implementation should be straightforward. Need to also support the system preference via prefers-color-scheme. Estimated effort: 3–5 days.',
                'priority'         => 'low',
                'category'         => 'feature',
                'status'           => 'open',
                'reporter_name'    => 'Bea Flores',
                'reporter_email'   => 'bea@example.com',
                'ai_summary'       => 'Feature request for dark mode with system preference support; design system is already CSS-variable-based.',
                'suggested_action' => 'Add to the next sprint backlog, create a dark theme token set, and implement via prefers-color-scheme media query.',
            ],
            [
                'title'            => 'Third-party payment webhook failing with 401',
                'description'      => 'Stripe webhooks are returning 401 Unauthorized since 08:30 UTC today. Live payments are not being confirmed, orders are stuck in "pending" state. The webhook signing secret was rotated in Stripe dashboard but the environment variable on production may not have been updated.',
                'priority'         => 'critical',
                'category'         => 'infrastructure',
                'status'           => 'open',
                'reporter_name'    => 'Rico Mendoza',
                'reporter_email'   => 'rico@example.com',
                'ai_summary'       => 'Stripe webhooks failing with 401 since 08:30 UTC, blocking payment confirmation for all pending orders.',
                'suggested_action' => 'Update STRIPE_WEBHOOK_SECRET in production environment immediately and restart the web workers.',
            ],
            [
                'title'            => 'User profile image upload silently fails for PNGs over 2MB',
                'description'      => 'When users upload a PNG profile picture larger than 2MB, the upload appears to succeed in the UI (progress bar completes) but the image is never saved. No error is shown to the user. The server logs show a PHP memory_limit error being swallowed by the upload handler.',
                'priority'         => 'medium',
                'category'         => 'bug',
                'status'           => 'resolved',
                'reporter_name'    => 'Grace Uy',
                'reporter_email'   => 'grace@example.com',
                'ai_summary'       => 'PNG uploads over 2MB silently fail due to a swallowed PHP memory_limit error, giving users false success feedback.',
                'suggested_action' => 'Raise PHP memory_limit for the upload handler, add server-side file size validation, and surface errors to the client.',
            ],
            [
                'title'            => 'Add two-factor authentication (TOTP)',
                'description'      => 'Security team requires TOTP-based 2FA for all admin accounts by end of quarter. Should support Google Authenticator and Authy. Recovery codes must also be generated and stored securely (hashed). This is a compliance requirement for our SOC 2 audit.',
                'priority'         => 'high',
                'category'         => 'security',
                'status'           => 'in_progress',
                'reporter_name'    => 'Ian Go',
                'reporter_email'   => 'ian@example.com',
                'ai_summary'       => 'SOC 2 compliance requires TOTP 2FA for all admin accounts by end of quarter with recovery code support.',
                'suggested_action' => 'Use a battle-tested TOTP library, enforce 2FA on first admin login, and store recovery codes as bcrypt hashes.',
            ],
        ];

        foreach ($issues as $data) {
            $issue = Issue::create($data);

            // Apply escalation rules
            $result = $escalation->evaluate($issue);
            $issue->update([
                'escalated'         => $result['escalated'],
                'escalation_reason' => $result['reason'],
            ]);
        }
    }
}
