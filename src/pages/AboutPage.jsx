
import { Target, Users, Trophy, Globe, Heart, Zap } from 'lucide-react';

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

  const team = [
    {
      name: 'Kwame Asante',
      role: 'Founder & CEO',
      bio: 'Former professional FIFA player turned entrepreneur, passionate about developing African esports.',
      image: 'https://via.placeholder.com/200x200?text=KA'
    },
    {
      name: 'Amina Hassan',
      role: 'Head of Operations',
      bio: 'Tournament organizer with 8+ years experience in competitive gaming and event management.',
      image: 'https://via.placeholder.com/200x200?text=AH'
    },
    {
      name: 'David Okafor',
      role: 'Community Manager',
      bio: 'Gaming content creator and community builder focused on growing African esports presence.',
      image: 'https://via.placeholder.com/200x200?text=DO'
    },
    {
      name: 'Fatima Diallo',
      role: 'Technical Director',
      bio: 'Software engineer specializing in gaming platforms and esports technology solutions.',
      image: 'https://via.placeholder.com/200x200?text=FD'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Africa Rise Esports</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're more than just a platform – we're a movement dedicated to elevating African gaming 
            talent and creating opportunities for the next generation of esports champions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="card">
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
          
          <div className="card">
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
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="card text-center">
                  <Icon className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story */}
        <div className="card mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-300 max-w-none">
            <p className="mb-4">
              Africa Rise Esports was born from a simple observation: Africa has incredible gaming talent, 
              but limited opportunities to showcase and develop that talent on a professional level. 
              Founded in 2024 by a group of passionate gamers and entrepreneurs, we set out to change that narrative.
            </p>
            <p className="mb-4">
              Starting with our first FREE FIRE tournament in Cape Town with just 32 participants, we've grown 
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
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">5000+</div>
              <div className="text-gray-400">Active Gamers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">100+</div>
              <div className="text-gray-400">Tournaments Hosted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">20+</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">$50K+</div>
              <div className="text-gray-400">Prize Money</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
