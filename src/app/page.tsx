import IntegratedMarketplace from '../components/IntegratedMarketplace';
import FeaturedFreelancers from '../components/FeaturedFreelancers';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <IntegratedMarketplace />
      <Footer />
    </main>
  );
}
