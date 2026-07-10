'use client';

import { Links } from '@/app/components';

import '@/app/styles/main.css';

export default function Page() {
    return (
        <>
            <main>
                <section>
                    <Links />

                    <h1>Credits</h1>

                    <hr />

                    <p>
                        <b>Here are all of the fonts and assets used in this website!</b>
                    </p>

                    <h2>Fonts</h2>

                    <p>
                        JetBrains Mono -{' '}
                        <a
                            href="https://www.lanzoor.dev/credits/fonts#jetbrains-mono"
                            target="blank"
                        >
                            attribution link
                        </a>
                        <br />
                        Noto Sans Mono -{' '}
                        <a
                            href="https://www.lanzoor.dev/credits/fonts#noto-sans-mono"
                            target="blank"
                        >
                            attribution link
                        </a>
                    </p>

                    <h2>Icons</h2>

                    <p>
                        Home icon -{' '}
                        <a
                            href="https://www.lanzoor.dev/credits/assets#noah-jacobus"
                            target="blank"
                        >
                            attribution link
                        </a>
                        <br />
                        Hamburger icon -{' '}
                        <a
                            href="https://www.lanzoor.dev/credits/assets#krystonschwarze"
                            target="blank"
                        >
                            attribution link
                        </a>
                    </p>
                </section>
            </main>
        </>
    );
}
