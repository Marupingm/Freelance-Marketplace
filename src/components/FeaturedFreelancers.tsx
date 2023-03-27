"use client";

import Image from 'next/image';

const freelancers = [
  {
    name: 'Sarah Johnson',
    title: 'Full Stack Developer',
    rating: 4.9,
    reviews: 127,
    skills: ['React', 'Node.js', 'TypeScript'],
    image: '/placeholder.jpg',
  },
  {
    name: 'Michael Chen',
    title: 'UI/UX Designer',
    rating: 4.8,
    reviews: 93,
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    image: '/placeholder.jpg',
  },
  {
    name: 'Emma Wilson',
    title: 'Content Strategist',
    rating: 4.9,
    reviews: 156,
    skills: ['SEO', 'Copywriting', 'Content Marketing'],
    image: '/placeholder.jpg',
  },
];

export default function FeaturedFreelancers() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Freelancers</h2>
          <p className="mt-4 text-lg text-gray-600">Work with talented professionals from around the world</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {freelancers.map((freelancer, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
                    <Image
                      src={freelancer.image}
                      alt={freelancer.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{freelancer.name}</h3>
                    <p className="text-gray-600">{freelancer.title}</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 mr-1">★</div>
                  <span className="text-gray-900 font-semibold">{freelancer.rating}</span>
                  <span className="text-gray-600 ml-1">({freelancer.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} //  
//  
