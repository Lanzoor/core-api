'use client';
import { NavigationPanel } from '@/app/components';

import '@/app/styles/main.css';
import '@/app/styles/docs.css';

export default function Page() {
    return (
        <>
            <NavigationPanel />

            <main className="docs-page">
                <section>
                    <h1>Rate Limiting</h1>

                    <p className="dim">
                        Last updated @ <b>July 10th, 2026</b>
                    </p>

                    <p>
                        <code>api.lanzoor.dev</code> is protected by a multi-layer rate limiting
                        system powered by <code>@upstash/ratelimit</code>. This helps prevent abuse
                        and ensures service stability.{' '}
                        <b>Please respect the rate limits below to avoid getting blocked.</b>
                    </p>

                    <h2>About Multi-Layered Rate Limits</h2>

                    <p>
                        In most cases, a rate limit preset comes with <i>two rate limit layers.</i>
                    </p>

                    <ul>
                        <li>
                            <b>per second</b> - Prevents rapid burst attacks and aggressive
                            scripting.
                        </li>
                        <li>
                            <b>per minute</b> - Prevents sustained spam and overuse.
                        </li>
                    </ul>

                    <h2>Rate Limit Presets</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Preset</th>
                                <th>Limit</th>
                                <th>Time Window</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan={2}>
                                    <code>lenient</code>
                                </td>
                                <td>
                                    <b>5 requests</b>
                                </td>
                                <td>per second</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>60 requests</b>
                                </td>
                                <td>per minute</td>
                            </tr>

                            <tr>
                                <td rowSpan={2}>
                                    <code>normal</code>
                                </td>
                                <td>
                                    <b>5 requests</b>
                                </td>
                                <td>per second</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>20 requests</b>
                                </td>
                                <td>per minute</td>
                            </tr>

                            <tr>
                                <td rowSpan={2}>
                                    <code>strict</code>
                                </td>
                                <td>
                                    <b>2 requests</b>
                                </td>
                                <td>per second</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>10 requests</b>
                                </td>
                                <td>per minute</td>
                            </tr>

                            <tr>
                                <td>
                                    <code>paranoid</code>
                                </td>
                                <td>
                                    <b>1 request</b>
                                </td>
                                <td>per minute</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Custom Rate Limits</h2>

                    <p>
                        <b>Some routes may use a custom rate limit preset.</b> If so, it will be
                        clearly listed in the route's documentation, and the preset identifier{' '}
                        <code>custom</code> shall be used.
                    </p>

                    <h2 id="headers">Headers</h2>

                    <p>
                        <i>For now,</i> rate limit headers are only included when a request is
                        rejected with HTTP 429.
                    </p>

                    <ul>
                        <li>
                            <code>X-RateLimit-Preset</code>: The rate limit preset that applied to
                            your request. (e.g: <code>normal</code>, <code>paranoid</code>,{' '}
                            <code>custom</code>)
                        </li>
                        <li>
                            <code>X-RateLimit-Limit</code>: Represents the maximum number of
                            requests allowed within the window.
                        </li>
                        <li>
                            <code>X-RateLimit-Reset</code>: Represents the Unix timestamp in
                            milliseconds when the limits are reset.
                        </li>
                        <li>
                            <code>Retry-After</code>: Represents how many <i>seconds</i> remain
                            until the rate limit resets.
                        </li>
                    </ul>

                    <h2>Example</h2>

                    <p>
                        Here's a simple example of how a rate limit and its headers would look like:
                    </p>

                    <div className="codeblock">
                        HTTP/1.1 429 Too Many Requests
                        <br />
                        <br />
                        <span className="key">X-RateLimit-Preset</span>:{' '}
                        <span className="value">normal</span>
                        <br />
                        <span className="key">X-RateLimit-Limit</span>:{' '}
                        <span className="value">20</span>
                        <br />
                        <span className="key">X-RateLimit-Reset</span>:{' '}
                        <span className="value">1782012345678</span>
                        <br />
                        <span className="key">Retry-After</span>: <span className="value">34</span>
                    </div>

                    <h2>Reference</h2>

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

                    <h2>Tips</h2>

                    <ul>
                        <li>Implement exponential backoff if you're making multiple requests.</li>
                        <li>Cache responses whenever possible.</li>
                        <li>
                            Respect the <a href="#headers">headers</a>.
                        </li>
                    </ul>
                </section>
            </main>
        </>
    );
}
