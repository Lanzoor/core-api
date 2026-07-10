'use client';

import { useState, useEffect } from 'react';
import { Links } from '@/app/components';

import '@/app/styles/main.css';

export default function Page() {
    const [status, setStatus] = useState<any | null>(null);

    useEffect(() => {
        fetch('/status')
            .then((res) => res.json())
            .then((data) => {
                setStatus(data);
            })
            .catch((err) => console.warn('failed to fetch from status:\n\t', err));
    }, []);
    return (
        <>
            <main>
                <section>
                    <Links />

                    <h1>api.lanzoor.dev</h1>

                    <hr />

                    <p>
                        <b>
                            Welcome to <code>api.lanzoor.dev</code>! 👋
                        </b>
                        <br />
                        This section of the website contains some API function routes that I often
                        use.
                        <br />
                        <i>Expect things to be more experimental than production-ready.</i>
                    </p>

                    <footer>
                        frontend <code>{status?.data.versions.frontend ?? '...'}</code> | backend{' '}
                        <code>{status?.data.versions.backend ?? '...'}</code>
                    </footer>
                </section>
            </main>
        </>
    );
}
