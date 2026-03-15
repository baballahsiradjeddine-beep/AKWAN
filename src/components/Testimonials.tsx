import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useStore } from '../store/useStore';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Testimonials() {
  const { testimonials, fetchTestimonials } = useStore();
  const swiperRef = useRef<SwiperType>(null);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-brand-bg/20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-20"
        >
          <h2 className="text-xl md:text-5xl font-black text-brand-secondary relative inline-block">
            ماذا يقول أصدقاء أكوان؟
            <div className="absolute -bottom-1.5 md:-bottom-4 left-0 right-0 h-1.5 md:h-3 bg-brand-accent/40 -z-10 rounded-full" />
          </h2>
        </motion.div>

        <div className="relative px-2 md:px-24">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            speed={1000}
            grabCursor={true}
            className="pb-20 md:pb-24"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border-2 border-brand-primary/5 shadow-none flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 mb-12">
                  {/* Mobile Header: Avatar + Name + Stars */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-12 w-full">
                    <div className="flex flex-row md:flex-col items-center gap-4 md:gap-6 w-full md:w-auto">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 md:w-36 md:h-36 rounded-full p-1.5 md:p-2 border-4 border-brand-bg shadow-sm">
                          <img 
                            src={t.avatar || 'https://ui-avatars.com/api/?name=' + t.name} 
                            alt={t.name} 
                            className="w-full h-full rounded-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 md:bottom-3 md:right-3 bg-green-500 text-white p-1 md:p-2 rounded-full border-2 md:border-4 border-white shadow-md">
                          <svg className="w-2 h-2 md:w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      </div>

                      {/* Name and Stars Grouped on Mobile */}
                      <div className="flex flex-col items-start md:hidden gap-1">
                        <p className="text-brand-primary font-bold text-sm md:text-base">— {t.name}</p>
                        <div className="flex text-brand-accent gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center md:items-start gap-3 md:gap-6 flex-grow text-center md:text-right w-full">
                      {/* Desktop Stars */}
                      <div className="hidden md:flex text-brand-accent justify-start gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-10 h-10 ${i < t.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      
                      <p className="text-brand-secondary font-black text-base md:text-3xl leading-relaxed w-full">
                        "{t.text}"
                      </p>
                      
                      {/* Desktop Name */}
                      <p className="hidden md:block text-brand-primary font-bold text-2xl">— {t.name}</p>
                    </div>
                  </div>

                  {/* Quote Icon (Hidden on Mobile, Visible on Desktop) */}
                  <div className="hidden lg:block text-brand-primary/5 text-[12rem] font-serif select-none leading-none shrink-0">”</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center text-brand-secondary hover:bg-brand-primary hover:text-white transition-all border-2 border-gray-50 group"
          >
            <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl items-center justify-center text-brand-secondary hover:bg-brand-primary hover:text-white transition-all border-2 border-gray-50 group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
