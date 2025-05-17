export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Scamzap</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:text-gray-400">Home</a>
                    </li>
                    <li>
                        <a href="/about" className="hover:text-gray-400">About</a>
                    </li>
                    <li>
                        <a href="/contact" className="hover:text-gray-400">Contact</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}