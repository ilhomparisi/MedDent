import { useState } from 'react';
import { useSourceTracking } from '../hooks/useSourceTracking';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import KimUchunSection from '../components/KimUchunSection';
import DoctorsSection from '../components/DoctorsSection';
import PillChoiceSection from '../components/PillChoiceSection';
import ReviewsSection from '../components/ReviewsSection';
import ValueStackingSection from '../components/ValueStackingSection';
import PatientResultsSection from '../components/PatientResultsSection';
import FAQSection from '../components/FAQSection';
import FinalCTASection from '../components/FinalCTASection';
import BookingModal from '../components/BookingModal';
import ConsultationFormModal from '../components/ConsultationFormModal';
import Footer from '../components/Footer';
import StickyCountdown from '../components/StickyCountdown';

export default function HomePage() {
  useSourceTracking();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleBookClick = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceId(undefined);
  };

  const handleOpenConsultationModal = () => {
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultationModal = () => {
    setIsConsultationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black w-full max-w-full">
      <Navigation onBookClick={() => handleBookClick()} />
      <HeroSection onBookClick={() => handleBookClick()} />
      <KimUchunSection />
      <ValueStackingSection onOpenConsultation={handleOpenConsultationModal} />
      <ReviewsSection />
      <PatientResultsSection onOpenConsultation={handleOpenConsultationModal} />
      <DoctorsSection />
      <PillChoiceSection onOpenConsultation={handleOpenConsultationModal} />
      <FAQSection />
      <FinalCTASection onOpenConsultation={handleOpenConsultationModal} />
      <Footer onBookClick={() => handleBookClick()} onOpenConsultation={handleOpenConsultationModal} />
      <StickyCountdown onBookClick={() => handleBookClick()} hideCountdown={isConsultationModalOpen} />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseModal}
        preselectedServiceId={selectedServiceId}
      />
      <ConsultationFormModal
        isOpen={isConsultationModalOpen}
        onClose={handleCloseConsultationModal}
      />
    </div>
  );
}
