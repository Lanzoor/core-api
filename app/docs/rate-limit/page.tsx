'use client';
import { NavigationPanel } from '@/app/components';

import '@/app/styles/main.css';
import '@/app/styles/docs.css';

export default function RateLimitPage() {
    return (
        <>
            <NavigationPanel />

            <main className="docs-page">
                <section>
                    <h1 className="header">Rate Limiting</h1>

                    <p className="dim">
                        Last updated @ <b>June 7, 2026</b>
                    </p>

                    <p>
                        <code>api.lanzoor.dev</code> is protected by a multi-layer rate limiting system powered by <code>@upstash/ratelimit</code>. This helps prevent abuse and ensures service stability. <b>Please respect the rate limits below to avoid getting blocked.</b>
                    </p>

                    <h2 className="header">Current Rate Limits</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Limit</th>
                                <th>Time Window</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>5 requests</strong>
                                </td>
                                <td>per second</td>
                                <td>Prevents rapid burst attacks and aggressive scripting</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>20 requests</strong>
                                </td>
                                <td>per minute</td>
                                <td>Prevents sustained spam and overuse</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2 className="header">Reference</h2>

                    <p>
                        Please refer to the{' '}
                        <a
                            href="https://github.com/Lanzoor/core-api/tree/main/lib/rate-limit.ts"
                            target="_blank"
                        >
                            rate-limit.ts
                        </a>{' '}
                        helper script.
                    </p>

                    <h2 className="header">Tips</h2>

                    <ul>
                        <li>Implement exponential backoff if you're making multiple requests.</li>
                        <li>Cache responses whenever possible.</li>
                        <li>
                            Respect the <code>Retry-After</code> and <code>X-RateLimit-*</code> headers when available.
                        </li>
                    </ul>
                </section>
            </main>
        </>
    );
}
