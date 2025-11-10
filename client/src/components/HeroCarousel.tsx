import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: 'Discover Premium Products',
    subtitle: 'Experience quality and style with our curated collection',
    cta: 'Shop Now',
    link: '/shop',
    bg: 'from-dark via-dark-light to-dark',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Check out the latest additions to our collection',
    cta: 'Explore New',
    link: '/shop',
    bg: 'from-primary via-red-700 to-dark',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
  },
  {
    title: 'Exclusive Deals',
    subtitle: 'Up to 50% off on selected items this week',
    cta: 'Shop Deals',
    link: '/shop',
    bg: 'from-dark-light via-dark to-primary',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className={`relative h-full bg-gradient-to-r ${slide.bg} text-white`}>
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-20"
              />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-delay">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="btn-primary inline-flex items-center space-x-2 animate-fade-in-delay-2"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
