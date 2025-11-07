// src/pages/AboutPage.jsx

import { Target, Users, Trophy, Globe, Heart, Zap } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection'; // Import AnimatedSection

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from tournament organization to community building.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong connections and fostering collaboration among gamers across Africa.'
    },
    {
      icon: Trophy,
      title: 'Competition',
      description: 'Creating fair, exciting, and rewarding competitive environments for all skill levels.'
    },
    {
      icon: Globe,
      title: 'Unity',
      description: 'Bringing together diverse cultures and countries under the banner of competitive gaming.'
    }
  ];

  // --- *** UPDATED TEAM SECTION *** ---
  const team = [
    {
      name: 'NIKHIL SINGH BURAQ',
      role: 'CEO OF ARE',
      bio: 'Leading the charge in building the future of African esports and connecting gamers across the continent.',
      image: '/images/ceo.jpg'
    },
    {
      name: 'TEEKAY PRINCE',
      role: 'FOUNDER AND COMMUNITY MANAGER',
      bio: 'The visionary founder focused on building a strong, inclusive, and passionate gaming community.',
      image: '/images/founder.jpg'
    },
    {
      name: 'IBEKWE ISABEL',
      role: 'COMMUNITY MANAGER',
      bio: 'Dedicated to engaging with players, supporting teams, and ensuring a vibrant community experience.',
      image: '/images/community.jpg'
    }
  ];
  // --- *** END UPDATE *** ---

  return (
    // Padding is handled by the LayoutWrapper in App.jsx
    <div className="bg-dark-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 space-y-16">
        
        {/* Hero Section */}
        <AnimatedSection tag="div" className="text-center" delay={0}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Africa Rise Esports</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're more than just a platform – we're a movement dedicated to elevating African gaming 
            talent and creating opportunities for the next generation of esports champions.
          </p>
        </AnimatedSection>

        {/* Mission & Vision */}
        <AnimatedSection tag="div" className="grid grid-cols-1 lg:grid-cols-2 gap-8" delay={100}>
          <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To democratize esports opportunities across Africa by providing world-class tournament 
              infrastructure, community building tools, and pathways for gamers to showcase their 
              talents on both continental and global stages.
            </p>
          </div>
          
          <div className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              To establish Africa as a major force in global esports, where every talented gamer 
              has access to opportunities, resources, and communities that help them achieve their 
              competitive gaming dreams.
            </p>
          </div>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection tag="div" delay={200}>
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <AnimatedSection 
                  key={index}
                  tag="div"
                  className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center"
                  delay={200 + (index * 100)}
                >
                  <Icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Story */}
        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700" delay={300}>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-300 max-w-none">
            <p className="mb-4">
              Africa Rise Esports was born from a simple observation: Africa has incredible gaming talent, 
              but limited opportunities to showcase and develop that talent on a professional level. 
              Founded in 2024 by a group of passionate gamers and entrepreneurs, we set out to change that narrative.
            </p>
            <p className="mb-4">
              Starting with small community cups, we've grown 
              to host continental competitions featuring thousands of players across multiple games. 
              Our platform now connects gamers from over 20 African countries, providing them with 
              the tools and opportunities they need to compete at the highest levels.
            </p>
            <p>
              Today, we're proud to be the leading esports platform in Africa, but we're just getting started. 
              Our goal is to create a sustainable ecosystem where African gamers can not only compete 
              but thrive as professional esports athletes, content creators, and industry leaders.
            </p>
          </div>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection tag="div" delay={400}>
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <AnimatedSection 
                key={index} 
                tag="div" 
                className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700 text-center"
                delay={400 + (index * 100)}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary-500/50"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}