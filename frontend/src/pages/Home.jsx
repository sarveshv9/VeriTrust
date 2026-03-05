import React from 'react';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { useGSAPScrollZoom } from '../hooks/useGSAPScrollZoom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import FooterGradient from '../components/elements/FooterGradient';

const Home = () => {
    useSmoothScroll();

    useGSAPScrollZoom({
        maxScale: 1.25,
        minScale: 1,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
    });

    return (
        <>
            <div className="smooth-wrapper">
                <div className="smooth-content">
                    {/* Container for Header and Hero */}
                    <div className="hero-background-container">
                        <Header />
                        <Hero />
                    </div>
                    <HowItWorks />
                    <FooterGradient>
                        <CTASection />
                        <Footer />
                    </FooterGradient>
                </div>
            </div>
        </>
    );
};

export default Home;
