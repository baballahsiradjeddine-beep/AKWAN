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
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-brand-secondary mb-4">
            ماذا يقول أصدقاء أكوان؟
            <span className="block w-24 h-2 bg-brand-accent mx-auto mt-4 rounded-full"></span>
          </h2>
        </motion.div>

        <div className="relative px-16">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            className="pb-16"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-4">
                  {/* Quote Icon */}
                  <div className="text-brand-primary/10 text-6xl font-serif select-none">“</div>
                  
                  <div className="flex text-brand-accent justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>

                  <p className="text-brand-secondary font-bold text-lg md:text-xl leading-relaxed">
                    "{t.text}"
                  </p>
                  
                  <p className="text-brand-secondary/60 font-bold text-base">— {t.name}</p>

                  {/* Avatar */}
                  <div className="relative mt-2">
                    <img 
                      src={t.avatar || 'https://ui-avatars.com/api/?name=' + t.name} 
                      alt={t.name} 
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-secondary hover:bg-brand-primary hover:text-white transition-all border border-gray-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-secondary hover:bg-brand-primary hover:text-white transition-all border border-gray-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
