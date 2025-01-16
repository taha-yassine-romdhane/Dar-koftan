import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image with Gold Splash Effect */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // High-quality gold splash image
          alt="Dar Koftan - Collection Élégante"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <h1 className="mb-6 text-5xl font-bold">
          Dar Koftan
        </h1>
        <p className="mb-8 text-xl">
          Découvrez notre collection exclusive de caftans traditionnels
        </p>
        <Link 
          href="/collections"
          className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition hover:bg-gray-100"
        >
          Voir la Collection
        </Link>
      </div>
    </section>
  )
}