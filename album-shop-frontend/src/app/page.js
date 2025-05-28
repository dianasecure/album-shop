'user client'
import Link from 'next/link'

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-fuchsia-100">
        <h1 className="text-9xl text-[#634137]">recorDS</h1>
        <i className="text-[#634137]">For the love of music</i>
        <p>🎵</p>

        <div className="mt-50">

          <Link href="/user"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to user's page</button> </Link>
          <Link href="/admin"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to admin's page</button> </Link>

        </div>

      </div>
    );
  }
  