import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader, Search, Users } from 'lucide-react';

const Community = () => {
  const [searchInput, setSearchInput] = useState('');
  const [disorder, setDisorder] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestDisorder = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/disorder/latest');
        const data = await response.json();
        setSearchInput(data.disorder);
        setDisorder(data.disorder);
        await fetchRedditPosts(data.disorder);
      } catch (error) {
        console.error('Error fetching latest disorder:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestDisorder();
  }, []);

  const fetchRedditPosts = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      const posts = data.data.children.map(child => ({
        title: child.data.title,
        snippet: child.data.selftext.substring(0, 100),
        url: `https://reddit.com${child.data.permalink}`
      }));
      setPosts(posts);
      setDisorder(query);
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      fetchRedditPosts(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] p-4 pb-16">

      

      {/* Header with professional animation */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-white p-2 shadow-lg shadow-blue-500/30 mr-3 animate-pulse">
            <Users className="text-blue-700" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Community Support
          </h1>
        </div>
        <p className="text-center text-gray-100 max-w-2xl mx-auto text-lg mb-8">
          Connect with others who share similar experiences and find support in our community forums
        </p>
      </div>

      {/* Main content card */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Container with white background and slight transparency */}
        <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Decorative top bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-800"></div>
          
          <div className="p-8">
            {/* Search bar with professional design */}
            <div className="relative mb-8 transition-all duration-300 hover:scale-[1.01] group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-md">
                <div className="flex items-center px-4 text-gray-500">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search your mental condition..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 py-4 px-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                />
                <button 
                  onClick={handleSearch}
                  className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold hover:shadow-lg hover:from-blue-700 hover:to-sky-600 transition-all duration-300"
                >
                  Search
                  <ArrowRight className="ml-2" size={18} />
                </button>
              </div>
            </div>

            {/* Current condition display */}
            {disorder && (
              <div className="mb-8 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-sky-100 text-navy-700 font-medium">
                  Current condition: <span className="text-blue-800 font-semibold">{disorder}</span>
                </span>
              </div>
            )}

            {/* Posts grid with staggered animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
              {posts.length > 0 ? posts.map((post, index) => (
                <div
                  key={index}
                  className="card-container"
                  style={{ 
                    animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1 + 0.2}s`,
                    perspective: '1000px'
                  }}
                >
                  <div className="card-wrapper group relative w-full h-full transition-transform duration-700 hover:scale-[1.02]">
                    {/* Card with 3D effect */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transform">
                      {/* Card header with gradient */}
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-sky-500 transform transition-all duration-700 group-hover:h-3"></div>
                      
                      <div className="p-6 flex flex-col h-full relative">
                        {/* Subtle power effect highlight on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                          <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">{post.title}</h3>
                          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.snippet}...</p>
                          <a 
                            href={post.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-auto font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300 group"
                          >
                            View Post 
                            <ArrowRight className="ml-1 h-4 w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4">
                    <Search className="text-blue-500" size={24} />
                  </div>
                  <p className="text-gray-600 text-lg">
  Type a disorder name above to find related discussions on Reddit.
</p>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-navy-900 bg-opacity-80 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl animate-scaleIn">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-l-blue-600 border-t-transparent border-r-transparent border-b-transparent animate-spin"></div>
            </div>
            <p className="text-gray-800 text-xl font-medium">Loading posts...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Community;