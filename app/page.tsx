'use client';

import { useState, useEffect } from 'react';
import './page.css';

export default function Page() {
    const [status, setStatus] = useState<any | null>(null);

    useEffect(() => {
        fetch('https://api.lanzoor.dev/status')
            .then((res) => res.json())
            .then((data) => {
                setStatus(data);
            })
            .catch((err) => console.warn('failed to fetch from status:\n\t', err));
    }, []);
    return (
        <>
            <div className="container">
                <nav>
                    <a href="https://lanzoor.dev">home</a>
                    <a href="https://api.lanzoor.dev/status">status</a>
                    <a href="https://api.lanzoor.dev/docs">docs</a>
                </nav>
                <h1>api.lanzoor.dev</h1>
                <hr />
                <p>
                    <b>
                        Welcome to <code>api.lanzoor.dev</code>! 👋
                    </b>
                    <br />
                    This section of the website contains some API function routes that I often use.
                    <br />
                    <i>Expect things to be more experimental than production-ready.</i>
                    <br />
                    <b>Click one of the links above to get started!</b>
                </p>
                <footer>
                    frontend <code>{status?.versions.frontend ?? '...'}</code> | backend <code>{status?.versions.backend ?? '...'}</code>
                </footer>
            </div>
        </>
    );
}
