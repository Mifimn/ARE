import { Link } from 'react-router-dom';
import { Play, Users, Trophy, Star, ChevronRight, Calendar, MapPin } from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { label: 'Gamers Supported', value: '5000+' },
    { label: 'Tournaments Hosted', value: '100+' },
    { label: 'Countries Represented', value: '20+' },
    { label: 'Prize Money Distributed', value: '$50K+' },
  ];

  const featuredTournaments = [
    {
      id: 1,
      name: 'FIFA 24 African Championship',
      game: 'FIFA 24',
      date: '2024-02-15',
      prize: '$5,000',
      participants: 128,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Mobile Legends Continental Cup',
      game: 'Mobile Legends',
      date: '2024-02-20',
      prize: '$3,000',
      participants: 64,
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Call of Duty Warzone Africa',
      game: 'COD Warzone',
      date: '2024-02-25',
      prize: '$4,000',
      participants: 96,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop'
    },
  ];

  const testimonials = [
    {
      name: 'Kwame Asante',
      role: 'Pro FIFA Player',
      content: 'ARE gave me the platform to showcase my skills and compete at the highest level. The community here is incredible!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
    },
    {
      name: 'Amina Hassan',
      role: 'Mobile Legends Champion',
      content: 'Thanks to Africa Rise Esports, I was able to turn my passion for gaming into a career. The support is unmatched.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c02e02d1?w=60&h=60&fit=crop&crop=face'
    },
    {
      name: 'David Okafor',
      role: 'Tournament Organizer',
      content: 'The tools and community at ARE make organizing tournaments seamless. It\'s the future of African esports.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop"
            alt="Esports Arena"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Africa Rise Esports
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-primary-400">
            Where Legends Are Born
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the fastest-growing esports community in Africa. Compete, connect, and rise to greatness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
              Join the Movement
              <ChevronRight className="ml-2" size={20} />
            </Link>
            <Link to="/tournaments" className="btn-secondary text-lg px-8 py-4 inline-flex items-center">
              <Play className="mr-2" size={20} />
              Watch Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Africa Rise Esports</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're dedicated to building the premier esports ecosystem in Africa, providing opportunities
              for gamers to compete, grow, and achieve their dreams on both continental and global stages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Community First</h3>
              <p className="text-gray-300">
                Building strong connections between gamers, organizers, and fans across the continent.
              </p>
            </div>
            <div className="card text-center">
              <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Competitive Excellence</h3>
              <p className="text-gray-300">
                Organizing world-class tournaments that showcase the best talent Africa has to offer.
              </p>
            </div>
            <div className="card text-center">
              <Star className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Rising Stars</h3>
              <p className="text-gray-300">
                Nurturing the next generation of African esports champions and content creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Tournaments</h2>
            <p className="text-xl text-gray-300">
              Don't miss out on these exciting upcoming competitions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTournaments.map((tournament) => (
              <div key={tournament.id} className="card hover:scale-105 transition-transform">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
                <p className="text-primary-400 font-medium mb-2">{tournament.game}</p>
                <div className="flex items-center text-gray-400 mb-2">
                  <Calendar size={16} className="mr-2" />
                  {new Date(tournament.date).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-400 font-semibold">{tournament.prize}</span>
                  <span className="text-gray-400">{tournament.participants} players</span>
                </div>
                <Link
                  to={`/tournament/${tournament.id}`}
                  className="btn-primary w-full text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-primary-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}