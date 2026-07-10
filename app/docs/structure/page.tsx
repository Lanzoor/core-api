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
                    <h1>Response Structure</h1>

                    <p className="dim">
                        Last updated @ <b>July 10th, 2026</b>
                    </p>

                    <p>
                        This page lists the generic response structure convention that most
                        endpoints follow.
                    </p>

                    <h2>Body Structure</h2>

                    <ul>
                        <li>
                            <span className="key">success</span>:{' '}
                            <span className="type">boolean</span>
                            <br />
                            Indicates whether the request was completed successfully.
                        </li>
                        <li>
                            <span className="key">data</span>?: <span className="type">any</span>
                            {' | '}
                            <span className="type">unknown</span>
                            {' | '}
                            <span className="type">JSON</span>
                            {' | '}
                            <span className="type">Record</span>
                            {'<'}
                            <span className="type">any</span>, <span className="type">any</span>
                            {'>'}
                            <br />
                            Contains the data returned by the endpoint.{' '}
                            <i>Its structure depends on the specific route.</i>
                        </li>
                        <li>
                            <span className="key">data</span>.<span className="key">error</span>?:{' '}
                            <span className="type">string</span>
                            <br />
                            Contains a brief description of the error if the request fails.
                        </li>
                        <li>
                            <span className="key">data</span>.<span className="key">message</span>?:{' '}
                            <span className="type">string</span>
                            <br />
                            Contains an optional message returned by the endpoint.
                        </li>
                    </ul>

                    <p>
                        The structure of <span className="key">data</span> may vary depending on the
                        endpoint. Make sure to refer to the corresponding route documentation for
                        details.
                    </p>

                    <h3>Examples</h3>

                    <h4>Success</h4>

                    <div className="codeblock">
                        <span className="key">success</span>: <span className="value">true</span>
                        <br />
                        <span className="key">data</span>:{' {'}
                        <div className="indent">
                            {'    '}
                            <span className="key">message</span>:{' '}
                            <span className="value">'Hello, World!'</span>,
                            <br />
                            <span className="key">foo</span>: <span className="value">'bar'</span>,
                            <br />
                            <span className="key">baz</span>: <span className="value">123</span>
                        </div>
                        {'}'}
                    </div>

                    <h4>Failure</h4>

                    <div className="codeblock">
                        <span className="key">success</span>: <span className="value">false</span>,
                        <br />
                        <span className="key">data</span>:{' {'}
                        <div className="indent">
                            {'    '}
                            <span className="key">error</span>:{' '}
                            <span className="value">'Too many requests in a certain window'</span>,
                            <br />
                            <span className="key">message</span>:{' '}
                            <span className="value">
                                'You're being rate limited!\nPlease refer to
                                https://api.lanzoor.dev/docs/rate-limit for more information.'
                            </span>
                        </div>
                        {'}'}
                    </div>

                    <h2>Header Structure</h2>

                    <ul>
                        <li>
                            <span className="key">status</span>:{' '}
                            <span className="type">number</span>
                            <br />
                            The HTTP status code returned by the response.
                        </li>
                        <li>
                            ...<span className="key">headers</span>:{' '}
                            <span className="type">HeadersInit</span>
                            <br />
                            Any additional response headers are returned as normal HTTP headers
                            rather than inside the JSON body.
                        </li>
                    </ul>
                    <h3>Example</h3>

                    <div className="codeblock">
                        <span className="key">status</span>: <span className="value">403</span>
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
                </section>
            </main>
        </>
    );
}
