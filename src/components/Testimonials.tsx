export default function Testimonials() {
  const testimonials = [
    {
      quote: "Finding the perfect developer for my project was a breeze. The quality of work exceeded my expectations!",
      author: "David Miller",
      role: "Startup Founder",
      company: "TechVision",
    },
    {
      quote: "As a freelancer, this platform has helped me connect with amazing clients and grow my business.",
      author: "Lisa Chen",
      role: "UX Designer",
      company: "Freelance",
    },
    {
      quote: "The talent pool here is exceptional. We've built our entire design team through this marketplace.",
      author: "James Wilson",
      role: "Creative Director",
      company: "DesignCo",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What People Say</h2>
          <p className="mt-4 text-lg text-gray-600">Success stories from our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <div className="text-2xl text-blue-500 mb-4">"</div>
              <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-gray-600">{testimonial.role}</p>
                <p className="text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} //  
//  
