import Link from "next/link"

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
            <Link href="#">
                <svg
                    className=" h-6 w-6 text-white"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                </svg>
                <span className="sr-only">News Page</span>
            </Link>
            <nav className="flex space-x-4">
                <Link href="#">
                    Home
                </Link>
                <Link href="#">
                    World
                </Link>
                <Link href="#">
                    Politics
                </Link>
                <Link href="#">
                    Business
                </Link>
                <Link href="#">
                    Technology
                </Link>
                <Link href="#">
                    Science
                </Link>
                <Link href="#">
                    Health
                </Link>
            </nav>
            <div className="flex items-center border border-white rounded-md ">
                <input
                    aria-label="Search"
                    className="px-2 py-1 bg-transparent text-white rounded-l-md focus:outline-none"
                    placeholder="Search"
                    type="search"
                />
                <button className="px-2 py-1 bg-white rounded-r-md">
                    <svg
                        className=" h-5 w-5 text-gray-800"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </div>
        </header>
    )
}

