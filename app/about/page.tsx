'use client';

import { useState, useEffect } from 'react';
import { Links } from '@/app/components';

import '@/app/styles/main.css';

export default function Page() {
    return (
        <>
            <section>
                <Links />
                <h1>
                    About <code>api.lanzoor.dev</code>
                </h1>
                <hr />
                <p>
                    <b>
                        <code>api.lanzoor.dev</code> is a backend service + small website built with{' '}
                        <a
                            href="https://nextjs.org/"
                            target="_blank"
                        >
                            NextJS
                        </a>
                        .
                    </b>
                    <br />
                    This section of the website contains some API function routes that I often use for my websites and my programs.
                    <br />
                </p>
            </section>
        </>
    );
}
