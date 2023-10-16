"use client";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Get Started?</h2>
          <p className="mt-4 text-xl text-gray-100">Join our community of freelancers and clients today</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold">Find Work</button>
            <button className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-semibold">Hire Talent</button>
          </div>
        </div>
      </div>
    </section>
  );
} //  
//  
