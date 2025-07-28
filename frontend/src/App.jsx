import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GigsSection from './components/GigsSection';
import CTASection from './components/CTASection';
import ReviewModal from './components/ReviewModal';
import { useModal } from './hooks/useModal';
import './styles/App.css';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

const App = () => {
  const { 
    isOpen: isReviewModalOpen, 
    openModal: openReviewModal, 
    closeModal: closeReviewModal 
  } = useModal();

  const handleSearchGig = (searchTerm) => {
    console.log('Searching for gigs:', searchTerm);
  };

  return (
    <div className="app">
      <Header />
      <Hero onSearch={handleSearchGig} />
      <GigsSection />
      <HowItWorks />
      <CTASection onOpenReviewModal={openReviewModal} />
      <Footer />
      
      {isReviewModalOpen && (
        <ReviewModal onClose={closeReviewModal} />
      )}
    </div>
  );
};

export default App;
