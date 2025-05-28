'user client'
import Link from 'next/link'

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-fuchsia-100">
        <h1 className="text-9xl font-bold text-[#634137]">recorDS</h1>
        <h1 className="text-4xl font-bold text-stone-950">Welcome to recorDS</h1>
        <p className="text-xl text-stone-950 mt-4">Your one-stop shop for music albums</p>

        <div className="mt-50">
          <Link href="/user"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to user&apos;s page</button> </Link>
          <Link href="/admin"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to admin&apos;s page</button> </Link>
        </div>
      </div>
    );
}
  