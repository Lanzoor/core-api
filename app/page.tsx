'use client';

import { useState, useEffect } from 'react';

import './page.css';

const themes: string[] = ['dark', 'light'];

export default function Page() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const stored = localStorage.getItem('theme');

        if (stored && themes.includes(stored)) {
            setTheme(stored);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    function toggleTheme() {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

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
                    welcome to <code>api.lanzoor.dev</code>! 👋
                    <br />
                    this section of the website contains some API function routes that I often use
                    <br />
                    expect things to be more experimental than production-ready
                    <br />
                    <b>click one of the links above to get started!</b>
                </p>

                <button onClick={toggleTheme}>
                    <img
                        src="/icons/color-mode.svg"
                        alt="theme"
                    />
                </button>

                <footer>
                    Last updated @<code id="footer--last-updated">...</code>| frontend
                    <code id="footer--frontend">...</code>| backend
                    <code id="footer--backend">...</code>
                </footer>
            </div>
        </>
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('https://api.lanzoor.dev/status');
        const data = await res.json();

        const lastUpdated = document.getElementById('footer--last-updated');
        const frontend = document.getElementById('footer--frontend');
        const backend = document.getElementById('footer--backend');

        if (lastUpdated) lastUpdated.textContent = new Date(data.lastUpdated).toLocaleDateString();
        if (frontend) frontend.textContent = data.versions.frontend;
        if (backend) backend.textContent = data.versions.backend;
    } catch (error) {
        console.warn('failed to fetch from status:\n\t', error);
    }
});
