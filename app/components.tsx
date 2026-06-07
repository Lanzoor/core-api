import { useEffect, useState } from 'react';

export function Links() {
    return (
        <nav className="links">
            <a href="/">home</a>
            <a href="/about">about</a>
            <a href="/docs">docs</a>
            <a href="/status">status</a>
            <a href="/credits">credits</a>
        </nav>
    );
}

export function NavigationPanel() {
    const [panelOpen, setPanelOpen] = useState<boolean>(false);

    return (
        <>
            <nav className="top-panel">
                <div className="buttons">
                    <button onClick={() => window.location.replace('/')}>
                        <img src="/icons/home.svg" />
                    </button>

                    <button onClick={() => setPanelOpen((v) => !v)}>
                        <img src="/icons/hamburger.svg" />
                    </button>
                </div>

                <h1>
                    The <code>api.lanzoor.dev</code> Documentation
                </h1>
            </nav>

            <nav
                className={`navigation-overlay${panelOpen ? ' open' : ''}`}
                onClick={() => setPanelOpen((v) => !v)}
            >
                <nav className={`navigation-panel${panelOpen ? ' open' : ''}`}>
                    <a href="/">↩ Go back to home</a>

                    <h3>
                        <a href="/docs">Documentation</a>
                    </h3>

                    <a href="/docs/rate-limit">Rate Limit</a>
                </nav>
            </nav>
        </>
    );
}
