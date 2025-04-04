"use client";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import { ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

export default function LandingPage() {
    const router = useRouter();
    const { isSignedIn } = useUser();

    const handleGetStarted = () => {
      if (isSignedIn) {
        router.push('/dashboard');
      } else {
        toast.error('Please sign in to continue');
      }
    };
  return (
    <div className="min-h-screen flex flex-col relative px-0 py-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/stunning-cityscapes-banner-with-cute-cloud-design_1017-50618.jpg?ga=GA1.1.184796346.1743337347&semt=ais_hybrid')",
          opacity: 0.2,
        }}
      ></div>

      <Header />
      <main className="flex-1 relative z-10 flex items-center justify-center px-10">
        <div className="flex gap-32 items-center w-full max-w-7xl mx-auto">
          <div className="w-5/12">
            <div className="relative">
              <h1 className="text-9xl mx-20 font-serif">Sync</h1>
              <h1 className="text-9xl mx-40 italic -mt-10">City</h1>
              <div className="mt-1 mx-14 text-lg">Collaborate, Support, Integrate</div>
            </div>
          </div>

          <div className="w-7/12 flex flex-col gap-6">
            <div className="text-4xl font-medium relative p-8">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-black"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-black"></div>
              <span className="text-4xl mx-16 font-serif tracking-wider">&ldquo;Collaborative Web </span>{' '}
              <br /> <span className="font-serif tracking-wider">Solutions: Where Expertise</span>{' '}
              <br /> <span className="mx-16 font-serif tracking-wider"> Meets Innovation&rdquo;</span>
            </div>
            <div className="flex mx-48">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md flex items-center gap-2 hover:bg-green-600 hover:shadow-lg transition-all w-fit"
              >
                Get Started
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <section className="relative z-10 py-16 px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">About us</h2>
          <div className="bg-gray-50/30 border rounded-full text-xl leading-relaxed text-gray-700 max-w-10xl p-4">
            &ldquo;Sync City is all about collaboration, resources, and projects that drive innovation and
            efficiency. We bring together experts, tools, and ideas to create seamless digital
            solutions that empower your vision and transform your online presence.&rdquo;
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
