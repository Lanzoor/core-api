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
                    <h1 className="header">Changelog</h1>

                    <p>This page contains a list of all changes and updates made to the API.</p>

                    <blockquote>
                        <code>https://www.lanzoor.dev/projects/core-api/changelog</code> redirects here.
                        <br />
                        For the version naming conventions, please check{' '}
                        <a
                            href="https://www.lanzoor.dev/docs/conventions/versions"
                            target="_blank"
                        >
                            this document
                        </a>
                        .
                        <br />
                        For the changelog conventions, please check{' '}
                        <a
                            href="https://www.lanzoor.dev/projects/core/changelog#legend"
                            target="_blank"
                        >
                            this document
                        </a>
                        .
                    </blockquote>
                    <hr />

                    <h1 id="v26-1-15">Major update v26.1.15</h1>

                    <p className="dim">
                        Release date: <b>June 21st, 2026</b>
                    </p>

                    <h2>API</h2>

                    <ul>
                        <li>
                            ~ <b>Completely reworked the rate limit system.</b> Please refer to <a href="/docs/rate-limit">/docs/rate-limit</a> for the new changes, and adjust your scripts accordingly.
                        </li>
                    </ul>

                    <h2>Webpage</h2>

                    <ul>
                        <li>+ Added style definitions for codeblock elements.</li>
                        <li>~ Updated rate limit documentation to match the new changes.</li>
                        <li>~ Improved style definitions for margins, and let the container automatically do the job.</li>
                    </ul>

                    <h1 id="v26-1-14-1">Minor update v26.1.14-1</h1>

                    <p className="dim">
                        Release date: <b>June 10th, 2026</b>
                    </p>

                    <h2>Webpage</h2>

                    <ul>
                        <li>
                            + Added a changelog page at <code>/docs/changelog</code>.
                        </li>
                        <li>
                            + Added style definitions for <code>ul</code> elements.
                        </li>
                        <li>
                            ~ Unified the margin space above and below <code>hr</code> elements.
                        </li>
                    </ul>
                </section>
            </main>
        </>
    );
}
