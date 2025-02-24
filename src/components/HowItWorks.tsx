export default function HowItWorks() {
  const steps = [
    { number: '01', title: 'Create Your Profile', description: 'Sign up and showcase your skills or post your project requirements' },
    { number: '02', title: 'Connect', description: 'Find the perfect match for your project or get hired for your expertise' },
    { number: '03', title: 'Collaborate', description: 'Work together seamlessly with secure payments and communication' },
    { number: '04', title: 'Complete', description: 'Deliver great results and build your reputation in the marketplace' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">Your journey to successful freelancing starts here</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-6">{step.number}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 