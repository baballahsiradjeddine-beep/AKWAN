import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { testimonials, fetchTestimonials } = useStore();

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-800 text-center mb-12">آراء عملائنا</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                {t.avatar && <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />}
                <div>
                  <h3 className="font-bold text-gray-800">{t.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
