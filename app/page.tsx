import HeroSection from './components/HeroSection'
import TopProduitsSection from './components/TopProduitsSection'
import AProposSection from './components/AProposSection'
import TopVentSection from './components/TopVentSection'

export default async function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <TopProduitsSection />
      <TopVentSection />
      <AProposSection />
      
    </main>
  )
}