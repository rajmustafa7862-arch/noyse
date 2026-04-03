import PageLoader from '@/components/home/PageLoader'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import TickerBar from '@/components/home/TickerBar'
import WhySection from '@/components/home/WhySection'
import FeaturesSection from '@/components/home/FeaturesSection'
import NewsGrid from '@/components/home/NewsGrid'
import DropsSection from '@/components/home/DropsSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <HeroSection />
      <TickerBar />
      <WhySection />
      <FeaturesSection />
      <NewsGrid />
      <DropsSection />
      <CTASection />
      <Footer />
    </>
  )
}
