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

                    <h1 id="v26-1-14-1">Webpage update v26.1.14-1</h1>

                    <p className="dim">
                        Release date: <b>June 10th, 2026</b>
                    </p>

                    <ul>
                        <li>
                            + Added changelog page at <code>/docs/changelog</code>
                        </li>
                        <li>
                            + Added style definitions for <code>ul</code> elements
                        </li>
                        <li>
                            {'>'} Unified the margin space above and below <code>hr</code> elements
                        </li>
                    </ul>
                </section>
            </main>
        </>
    );
}
