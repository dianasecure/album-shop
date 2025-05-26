'user client'
import Link from 'next/link'

export default function Home() {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-fuchsia-100">
        <h1 className="text-4xl font-bold text-stone-950">Welcome to Album Shop</h1>
        <p className="text-xl text-stone-950">Discover and shop your favorite albums</p>
        <p className="text-xl text-stone-950">We&apos;ve got the best selection of CDs and vinyl records</p>
        <p className="text-xl text-stone-950">Don&apos;t miss out on our exclusive collection</p>

        <div className="mt-50">

          <Link href="/user"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to user's page</button> </Link>
          <Link href="/admin"> <button className="bg-[#634137] text-red-50 hover:text-red-200 py-2 px-4 rounded">Go to admin's page</button> </Link>

        </div>

      </div>
    );
  }
  