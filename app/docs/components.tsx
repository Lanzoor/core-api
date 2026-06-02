export default function NavigationPanel() {
    return (
        <nav className="navigation-panel">
            <a href="/">↩ Go back to home</a>

            <h3>
                <a href="/docs">Documentation</a>
            </h3>

            <div className="nav-group">
                <a href="/docs/routes">Routes</a>

                <div className="nav-children">
                    <a href="/docs/routes/status">
                        <code>/status</code>
                    </a>

                    <div className="nav-children">
                        <a href="/docs/routes/status/discord">
                            <code>/status/discord</code>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
