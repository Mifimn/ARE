// src/pages/NewsPage.jsx

import { useState } from 'react';
import { Calendar, User, Tag, Search, TrendingUp } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection'; // Import the animation wrapper

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'tournaments', 'updates', 'community', 'esports'];

  const news = [
    { id: 1, title: 'FIFA 24 African Championship Registration Now Open', excerpt: 'The biggest FIFA tournament...', content: '...', category: 'tournaments', author: 'Tournament Team', date: '2024-02-12', image: 'https://via.placeholder.com/600x300?text=FIFA+24+Championship', featured: true },
    { id: 2, title: 'Platform Update: New Team Management Features', excerpt: 'Enhanced team creation tools...', content: '...', category: 'updates', author: 'Development Team', date: '2024-02-10', image: 'https://via.placeholder.com/600x300?text=Platform+Update', featured: false },
    { id: 3, title: 'Spotlight: Rising Stars of African Mobile Legends', excerpt: 'Meet the top 10 Mobile Legends players...', content: '...', category: 'community', author: 'Editorial Team', date: '2024-02-08', image: 'https://via.placeholder.com/600x300?text=Mobile+Legends+Stars', featured: true },
    { id: 4, title: 'New Partnership with Gaming Hardware Sponsors', excerpt: 'We\'ve partnered with leading gaming hardware companies...', content: '...', category: 'updates', author: 'Partnership Team', date: '2024-02-05', image: 'https://via.placeholder.com/600x300?text=Hardware+Partnership', featured: false },
    { id: 5, title: 'COD Warzone Africa Championship Results', excerpt: 'Congratulations to Team Thunder Hawks...', content: '...', category: 'tournaments', author: 'Tournament Team', date: '2024-02-03', image: 'https://via.placeholder.com/600x300?text=COD+Championship', featured: false },
    { id: 6, title: 'The Growth of Esports in West Africa', excerpt: 'An analysis of how competitive gaming is expanding...', content: '...', category: 'esports', author: 'Research Team', date: '2024-02-01', image: 'https://via.placeholder.com/600x300?text=West+Africa+Esports', featured: false }
  ];

  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = news.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  return (
    // Removed pt-20. Padding handled in App.jsx main wrapper
    <div className="bg-dark-900 text-white">
      {/* Container with padding managed by App.jsx */}
      <div className="space-y-8"> {/* Add vertical spacing */}

        {/* Header */}
        <AnimatedSection tag="div" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest from Africa Rise Esports and the African gaming community
          </p>
        </AnimatedSection>

        {/* Search and Filters */}
        <AnimatedSection tag="div" className="mb-8" delay={100}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <AnimatedSection
                key={category}
                tag="button"
                delay={index * 50} // Stagger filter buttons
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* Featured Articles */}
        {selectedCategory === 'all' && featuredNews.length > 0 && (
          <AnimatedSection tag="div" className="mb-12" delay={200}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUp className="mr-2 text-primary-500" size={24} />
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article, index) => (
                // Animate each featured card
                <AnimatedSection
                  key={article.id}
                  tag="div"
                  className="card hover:scale-105 transition-transform"
                  delay={index * 150} // Stagger featured cards
                  direction={index % 2 === 0 ? 'left' : 'right'} // Alternate slide direction
                >
                  <div className="relative mb-4">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded-lg"/>
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">Featured</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <Tag size={14} className="mr-1" /> <span className="capitalize">{article.category}</span>
                    <span className="mx-2">•</span>
                    <Calendar size={14} className="mr-1" /> <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-300 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm"><User size={14} className="mr-1" /> <span>{article.author}</span></div>
                    {/* Add Link component if you have a details page */}
                    <button className="btn-secondary">Read More</button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Regular Articles */}
        <AnimatedSection tag="div" delay={300}>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((article, index) => (
              // Animate each regular card
              <AnimatedSection
                key={article.id}
                tag="div"
                className="card hover:scale-105 transition-transform"
                delay={index * 100} // Stagger regular cards
              >
                <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-lg mb-4"/>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Tag size={14} className="mr-1" /> <span className="capitalize">{article.category}</span>
                  <span className="mx-2">•</span>
                  <Calendar size={14} className="mr-1" /> <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-400 text-xs"><User size={12} className="mr-1" /> <span>{article.author}</span></div>
                  {/* Add Link component if you have a details page */}
                  <button className="btn-secondary text-sm">Read More</button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* No Results Message */}
        {filteredNews.length === 0 && (
          <AnimatedSection className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new content.</p>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
