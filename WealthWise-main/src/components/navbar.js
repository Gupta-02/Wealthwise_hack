import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Layout, 
  Settings, 
  Bell, 
  Search, 
  Activity,
  X,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = ({mail}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

 

  const handleProfile = async (e) => {
    try {
      const getCookie = Cookies.get('sessionToken');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}findemail?email=${encodeURIComponent(mail)}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setData(response.data.user);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  }

  useEffect(() => {
    if(mail){
      handleProfile()
    }
  },[mail])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  

  const handleLogout = () => {
    Cookies.remove('sessionToken');
    navigate('/',{ replace: true });
  };


  const navItems = [
    { 
      icon: <Home className="w-5 h-5" />, 
      label: 'Home', 
      key: 'home' 
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Chat With Niveshak',
      key: 'Chat With Niveshak'
    },
    // { 
    //   icon: <Activity className="w-5 h-5" />, 
    //   label: 'Analytics', 
    //   key: 'analytics' 
    // },
    // { 
    //   icon: <Settings className="w-5 h-5" />, 
    //   label: 'Settings', 
    //   key: 'settings' 
    // }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 
          shadow-lg transform transition-all duration-300
          ${
            isMobileMenuOpen
            ? 'bg-gradient-to-br from-purple-800/75 to-blue-900/75'
            : 'bg-gradient-to-br from-white-600/80 to-blue-800/40'
          }
        `}
      >
        <div className="mx-auto py-3 px-8">
          <div className="flex items-center justify-between ">
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-4" onClick={() => navigate('/home')} style={{cursor:'pointer'}}>
              <img 
                src="/navlogo1.png" 
                alt="App Logo" 
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold text-white">WealthWise</span>
            </div>

            {/* Desktop Navigation - Center */}
  
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key} 
                  onClick={() => {
                    setActiveTab(item.key);
                    if (item.key === 'home') {
                     navigate('/home',{ replace: true });
                    }
                    if (item.key === 'Chat With Niveshak') {
                      navigate('/chatbot',{ replace: true });
                     }
                  }}
                  className={`
                    group relative flex items-center 
                    transition-all duration-300 
                    ${activeTab === item.key 
                      ? 'text-white scale-110' 
                      : 'text-white/70 hover:text-white'}
                  `}
                >
                  {item.icon}
                  {activeTab === item.key && (
                    <span 
                      className="absolute -bottom-2 left-1/2 
                      -translate-x-1/2 
                      h-1 w-1 bg-white 
                      rounded-full 
                      animate"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Side - Profile and Interactions */}
            <div className="flex items-center space-x-4 relative">
              {/* Profile Photo */}
              <div 
                className="relative"
                onClick={handleClick}
                style={{marginRight:'5px', marginLeft:'110px'}}
              >
                <div 
                  onClick={() => {
                    if (!isMobile) {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {data.profile ? (
                    <img
                      src={data.profile}
                      alt={data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                      className="w-12 h-12 rounded-full 
                        border-2 border-white/70 
                        object-cover 
                        transform transition-all duration-300 
                        group-hover:scale-110 
                        group-hover:rotate-6 
                        group-hover:shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center 
                        border-2 border-white/70 
                        transform transition-all duration-300 
                        group-hover:scale-110 
                        group-hover:rotate-6 
                        group-hover:shadow-lg"
                    >
                      {data.name && data.name.charAt(0) ? (
                        <span className="text-xl font-semibold text-gray-800">
                          {data.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <span className="fa fa-user-alt text-xl font-semibold text-gray-800"></span>
                      )}
                    </div>
                  )}
                </div>

                
                {!isMobile && isProfileDropdownOpen && (
                  <div 
                  className="absolute right-0 top-full mt-2 w-80 h-50
                    bg-gradient-to-br from-white-600/80 to-blue-800/40 shadow-lg rounded-lg 
                    border border-red-500 
                    z-50 flex flex-col items-center justify-center"
                >
                  <div className="p-4 border-b border-red-500 text-center w-full">
                    <p className="text-sm font-semibold text-gray-200 whitespace-normal">
                      {data.name}
                    </p>
                    <p className="text-sm font-semibold text-gray-200 mt-2 whitespace-normal">{data.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 flex items-center justify-center 
                   
                    flex items-center 
                    text-red-500 hover:text-red-600"
                  >
                    <button className="w-4 h-4 "/>
                      Logout
                    </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>


      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 
          md:hidden " 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 
            bg-gradient-to-br from-purple-800/75 to-blue-900/75 shadow-lg rounded-t-3xl 
            animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 
              text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* User Profile Section */}

            
                  
            <div className="p-6 text-center border-b">
              {data.profile ? (
                <img
                  src={data.profile}
                  alt={data.name && data.name.charAt(0) ? data.name.charAt(0).toUpperCase() : 'Profile'}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center 
                    border-2 border-white/70 
                    transform transition-all duration-300 
                    group-hover:scale-110 
                    group-hover:rotate-6 
                    group-hover:shadow-lg 
                    cursor-pointer mx-auto mb-3"
                >
                  {data.name && data.name.charAt(0) ? (
                    <span className="text-xl font-semibold text-gray-800">
                      {data.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="fa fa-user-alt text-xl font-semibold text-gray-800"></span>
                  )}
                </div>
              )}
              <h2 className="text-xl text-gray-100 font-semibold">{data.name}</h2>
              <p className="text-gray-100">{data.email}</p>
            </div>

            {/* Mobile Navigation Items */}
            <div className="py-4">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    if (item.key === 'home') {
                     navigate('/home',{ replace: true });
                    }
                    if (item.key === 'Chat With Niveshak') {
                      navigate('/chatbot',{ replace: true });
                     }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full px-6 py-3 flex items-center 
                    transition-colors text-gray-100
                    hover:bg-blue-100 hover:text-purple-900

                      
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="p-4 border-t">
              <button 
                className="w-full py-2 
                bg-red-500 text-white 
                rounded-full 
                hover:bg-red-600 
                transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
