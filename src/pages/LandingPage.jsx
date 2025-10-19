// src/pages/LandingPage.jsx

import { Link } from 'react-router-dom';
import {
  Play, Users, Trophy, Star, ChevronRight, Gamepad2, Calendar, DollarSign,
  Gift, UserCheck, Download, BarChart, Award
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function LandingPage() {

  // --- Data ---
  const stats = [
    { icon: Users, value: '5000+', label: 'Active Gamers' },
    { icon: Trophy, value: '100+', label: 'Tournaments Hosted' },
    { icon: Calendar, value: '20+', label: 'Countries Represented' },
    { icon: DollarSign, value: '$50K+', label: 'Prize Money Paid' },
    { icon: Gamepad2, value: '6+', label: 'Supported Games' },
  ];
  const featuredGames = [
    { name: 'FIFA 24', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=250&fit=crop', href: '/tournaments?game=fifa' },
    { name: 'COD Warzone', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=250&fit=crop', href: '/tournaments?game=cod' },
    { name: 'Mobile Legends', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=250&fit=crop', href: '/tournaments?game=mlbb' },
    { name: 'Valorant', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=250&fit=crop', href: '/tournaments?game=valorant' },
  ];
   const actionImages = [
    '/images/action_1.jpg', // Make sure these files exist in public/images/
    '/images/action_2.jpg',
    '/images/action_3.jpg',
    '/images/action_4.jpg',
  ];
  const brands = [
    { name: 'Brand A', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandA' },
    { name: 'Brand B', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandB' },
    { name: 'Brand C', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandC' },
    { name: 'Brand D', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandD' },
    { name: 'Brand E', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandE' },
    { name: 'Brand F', logo: 'https://via.placeholder.com/100x40/374151/9ca3af?text=BrandF' },
  ];

  return (
    <div className="text-white">
      {/* Hero Section - Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden text-center">
        {/* Video and Overlay */}
        <div className="absolute inset-0 z-0">
          <video src="/images/intro.mp4" autoPlay loop muted playsInline preload="auto" poster="/images/intro_poster.jpg" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
        {/* Animated Content */}
        <AnimatedSection tag="div" className="z-10 p-4" delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Africa Rise Esports</h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6 text-primary-400 uppercase tracking-wider">The Home of African Esports</p>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Compete in top tournaments, connect with players, and build your legacy across the continent.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center transform transition-transform hover:scale-105">Join Now <ChevronRight className="ml-2" size={20} /></Link>
            <Link to="/tournaments" className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center transform transition-transform hover:scale-105"><Play className="mr-2" size={20} /> View Tournaments</Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animate the grid container */}
          <AnimatedSection tag="div" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
             {/* UPDATED: Using implicit return with parentheses */}
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100} tag="div">
                {/* Render the icon component directly */}
                <stat.icon className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </AnimatedSection>
            ))} {/* End map */}
          </AnimatedSection> {/* End grid container */}
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <AnimatedSection tag="h2" className="text-3xl md:text-4xl font-bold mb-12 uppercase tracking-wider">
             Featured Games
           </AnimatedSection>
           <AnimatedSection tag="div" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
             {featuredGames.map((game, index) => (
                <AnimatedSection key={game.name} tag={Link} to={game.href} delay={index * 100}
                  className="group block rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30">
                  <img src={game.image} alt={game.name} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                    </div>
                  </div>
                </AnimatedSection>
             ))}
             <AnimatedSection tag={Link} to="/tournaments" delay={featuredGames.length * 100}
                className="group flex items-center justify-center rounded-lg bg-dark-800 border-2 border-dark-700 hover:border-primary-500 transition-all duration-300 hover:scale-105 h-64"> {/* Match height */}
                 <div className="text-center p-4">
                    <div className="text-3xl font-bold text-primary-500 mb-2">+10</div>
                    <div className="text-gray-400 uppercase text-sm tracking-wider">More Games</div>
                  </div>
              </AnimatedSection>
          </AnimatedSection>
        </div>
      </section>

      {/* Alternating Sections */}
      {[
        { title: 'Compete Daily', icon: Trophy, text: 'Join daily ladders, weekly cups, and major championships. Prove your skill and climb the ranks.', points: ['Regular Matches & Tournaments', 'Skill-Based Matchmaking', 'Leaderboards & Rankings'], image: actionImages[0], direction: 'left'},
        { title: 'Earn Rewards', icon: Gift, text: 'Win prizes, unlock achievements, and earn exclusive rewards for your participation and performance.', points: ['Cash Prizes & Sponsor Loot', 'Digital Badges & Accolades', 'Platform Currency/Points'], image: actionImages[1], imageLeft: true, direction: 'right'},
        { title: 'Build Your Profile', icon: UserCheck, text: 'Showcase your stats, achievements, and match history. Connect with teammates and rivals.', points: ['Detailed Player Statistics', 'Customizable Profiles', 'Team Management Tools'], image: actionImages[2], direction: 'left'},
        { title: 'Dominate the Battleground', icon: BarChart, text: 'Master your favorite battle royale games. Track your performance, find squads, and conquer.', points: ['Battle Royale Leaderboards', 'Custom Matchmaking', 'Exclusive Events'], image: actionImages[3], imageLeft: true, direction: 'right'},
      ].map((section, index) => (
        <AnimatedSection key={index} tag="section" className={`py-20 overflow-x-hidden ${index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
              <AnimatedSection tag="div" direction={section.imageLeft ? 'right' : 'left'} className={`${section.imageLeft ? 'md:order-last' : ''}`} >
                <img src={section.image} alt={section.title} className="rounded-lg shadow-xl w-full h-auto max-h-[500px] object-cover" />
              </AnimatedSection>
              <AnimatedSection tag="div" direction={section.imageLeft ? 'left' : 'right'} delay={100}>
                <section.icon className="w-10 h-10 text-primary-500 mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider">{section.title}</h2>
                <p className="text-lg text-gray-300 mb-6">{section.text}</p>
                <ul className="space-y-3">
                  {section.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center text-gray-300">
                      <ChevronRight className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                 <Link to="/tournaments" className="mt-8 inline-flex items-center btn-primary">
                    Learn More <ChevronRight className="ml-2" size={16}/>
                 </Link>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      ))}

      {/* Brands Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection tag="h3" className="text-xl font-semibold text-gray-400 mb-8 uppercase tracking-wider">
            Brands We've Worked With
          </AnimatedSection>
          <AnimatedSection tag="div" className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {brands.map((brand, index) => (
              <AnimatedSection tag="img" key={index} src={brand.logo} alt={brand.name} delay={index * 50}
                className="h-8 md:h-10 filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-dark-900 text-center">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection tag="h2" className="text-3xl md:text-4xl font-bold mb-6" >Ready to Rise?</AnimatedSection>
            <AnimatedSection tag="p" className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto" delay={100}>
                Join the largest esports community in Africa. Sign up today and start competing!
            </AnimatedSection>
            <AnimatedSection tag={Link} to="/signup" delay={200}
              className="btn-primary text-lg px-10 py-4 inline-flex items-center justify-center transform transition-transform hover:scale-105">
              Create Your Account <ChevronRight className="ml-2" size={20} />
            </AnimatedSection>
         </div>
      </section>
    </div>
  );
}
