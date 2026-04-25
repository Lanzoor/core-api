import './globals.css';
import './page.css';

export default function Page() {
    return (
        <main>
            <h1>api.lanzoor.dev</h1>

            <p>
                Welcome to api.lanzoor.dev!
                <br />
                Check out{' '}
                <a href="https://api.lanzoor.dev/docs">
                    <code>/docs</code>
                </a>{' '}
                for more information.
                <br />
                Status: <code>/status</code>
            </p>
        </main>
    );
}
