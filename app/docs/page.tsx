'use client';

import { useState, useEffect } from 'react';
import NavigationPanel from './components';
import '@/app/styles/main.css';
import '@/app/styles/docs.css';

export default function Page() {
    return (
        <>
            <NavigationPanel />

            <main>
                <section>
                    <h1 className="header">
                        Welcome to the official <code>api.lanzoor.dev</code> documentation!
                    </h1>

                    <p>
                        This documentation contains information about all available endpoints, their expected responses, and other details that may be useful when working with the API.
                        <br />
                        <br />
                        <b>You can navigate to pages of this document by using the panel to the left.</b>
                    </p>

                    <blockquote>
                        <h2 className="header">Warning</h2>
                        <code>api.lanzoor.dev</code> is still an experimental service. Endpoints, response formats, and other functionality may change at any time without notice. Downtime, breaking changes, and unexpected behavior should be expected.
                        <br />
                        <b>Please do not rely on api.lanzoor.dev for production applications, automation, scripting, or other critical workflows unless you fully understand and accept these risks.</b> Thanks.
                    </blockquote>
                </section>
            </main>
        </>
    );
}
