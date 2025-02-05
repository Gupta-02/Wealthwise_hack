import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import 'font-awesome/css/font-awesome.min.css';
import Navbar from './navbar.js'
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react'



function extractVideoId(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|(?:https?:\/\/(?:www\.)?youtu\.be\/))([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    console.error('No match found for URL:', url);
    return null;
  }
}

function formatDuration(duration) {
  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  const match = duration.match(regex);
  
  if (!match) return 'Invalid duration format';
  
  const minutes = match[2] ? match[2] : '0';
  const seconds = match[3] ? match[3] : '0';
  
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function formatViews(views) {
  const numericViews = Number(views);
  if (isNaN(numericViews) || numericViews < 0) {
    return 'Invalid view count';
  }
  if (numericViews >= 1e6) {
    return (numericViews / 1e6).toFixed(1).replace(/\.0$/, '') + 'M views';
  } else if (numericViews >= 1e3) {
    return (numericViews / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views';
  } else {
    return numericViews + ' views';
  }
}

async function fetchYouTubeVideoDetails(link) {
  const API_KEY = 'AIzaSyC-y_81kkguQwtMrMBTYs-hDFmx3C_my0w';
  const videoId = extractVideoId(link);
  if (!videoId) {
    console.log('Invalid YouTube link!');
    return;
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,contentDetails,statistics`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.items.length > 0) {
      const video = data.items[0];

      const videoDetails = {
        name: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        duration: formatDuration(video.contentDetails.duration),
        views: formatViews(video.statistics.viewCount),
        videoUrl: `https://youtu.be/${videoId}`,
      };
      return videoDetails;
    } else {
      console.log('Video not found!');
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
  }
}


const Home = ({ mail }) => {
  const cld = new Cloudinary({ cloud: { cloudName: 'djlgmbop9' } });

  const [videoDetails, setVideoDetails] = useState([]);

  const videoLinks = [
    'https://www.youtube.com/watch?v=lqk2LppTl84&t=228s',
    'https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP',
    'https://youtu.be/Q0uXGQu55GM?si=B15Ob4M-WdtP0Sag',
    'https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA',
    'https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b',
    'https://youtu.be/7jvTrxh0kGc?si=xOKMXSjHdb-oaw-X',
    'https://youtu.be/raW2FIPnqIc?si=yGUBkLsnZgYuByhu',
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const details = await Promise.all(
          videoLinks.map(link => fetchYouTubeVideoDetails(link))
        );
        setVideoDetails(details.filter(detail => detail !== null));
      } catch (error) {
        console.error('Failed to fetch video details', error);
      }
    };

    fetchVideos();
  }, []);


  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage = {
      role: 'assistant',
      content: `You said: "${input.trim()}"`,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };



    const StocksData = () => {  
        const [activeButton, setActiveButton] = useState(null);

        const navigate = useNavigate();

        useEffect(() => {
          if (activeButton === "Expense Tracker") {
            navigate('/expensedate');
          }
          else if ( activeButton === "Personalized Mutual Funds"){
            navigate('/personal-MF');
          }
          else if ( activeButton === "Personalized FD"){
            navigate('/fd-recommendations');
          }
          else if ( activeButton === "Personalized Stocks"){
            navigate('/PersonalizedStocks');
          }

        }, [activeButton, navigate]);

        const personalizeButtons = [
            { 
              name: 'Personalized Stocks', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1116.5 16h-11z" />
                </svg>
              ),
              title:"🌟 Receive AI-driven stock suggestions crafted for your goals and risk preferences, making smart investing easier than ever! 💼"
            },
            { 
              name: 'Personalized FD', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              ),
              title:"🤖 Get AI-driven mutual fund suggestions tailored to your financial goals, risk appetite, and investment amount. Start building a stronger portfolio today! 💼"
            },
            { 
              name: 'Personalized Mutual Funds', 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              ),
              title:"🔍 Find the best-fixed deposit options tailored to your age, investment amount, risk level, and tenure. Secure your future with smart choices! 🏦"

            },
            { 
              name: 'Expense Tracker',
             icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512" fill="white">
                    <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/>
                </svg>
              ),
              title:"📊 Track your income and expenses, get AI insights, and discover strategies to boost savings and financial strength! 💰"
            }
          ];

      
        
        const investments = [
        {
            type: 'Stocks',
            items: [
              { name: 'ITC Ltd.', code: 'ITC', price: 470, icon: '₹', link: 'https://www.etmoney.com/stocks/itc-ltd/1353', image: 'itc_ktdtqa' },
              { name: 'Ramco Cements Ltd', code: 'RAMCOCEM', price: 1040.70, icon: '₹', link: 'https://www.etmoney.com/stocks/the-ramco-cements-ltd/2753', image: 'ramco_tcob7p' },
              { name: 'Lorenzini Apparels Ltd', code: 'LAL', price: 24.21, icon: '₹', link: 'https://www.etmoney.com/stocks/lorenzini-apparels-ltd/4352', image: 'Lorenzini_d2xax6' },
              { name: 'Tata Power Company', code: 'TATAPOWER', price: 428.45, icon: '₹', link: 'https://www.etmoney.com/stocks/tata-power-company-ltd/2418', image: 'tata_bdich9' },
              { name: 'Darshan Orna Ltd', code: 'DARSHANORNA', price: 6.05, icon: '₹', link: 'https://www.moneycontrol.com/india/stockpricequote/diamond-cuttingjewelleryprecious-metals/darshanorna/DO04', image: 'darshan_nhfscr' },
              { name: 'Titan Company Ltd', code: 'TITAN', price: 3508.85, icon: '₹', link: 'https://www.etmoney.com/stocks/titan-company-ltd/55', image: 'titan_arreis' },
              { name: 'Trent Ltd', code: 'TRENT', price: 7000.25, icon: '₹', link: 'https://www.etmoney.com/stocks/trent-ltd/844', image: 'trent_djzlq8' },
              { name: 'Bosch Ltd', code: 'BOSCHLTD', price: 36469.60, icon: '₹', link: 'https://www.etmoney.com/stocks/bosch-ltd/1150', image: 'bosch_ilhkn0' }
              
            ]
          },
          {
            type: 'Fixed Deposits',
            items: [
              { name: 'ICICI Bank', code: 'ICICI FD', return: 7.5, icon: '₹', link : 'https://www.etmoney.com/fixed-deposit/icici-bank-fd-rates/5', image: 'icici_yzot5k' },
              { name: 'HDFC Bank', code: 'HDFC FD', return: 7.2, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/hdfc-bank-fd-rates/4', image: 'hdfv_jl9z3y' },
              { name: 'RBL Bank', code: 'RBL FD', return: 7.8, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/rbl-bank-fd-rates/16', image: 'bank_RBL_u7p6jc' },
              { name: 'Bank of Baroda', code: 'BOB FD', return: 7.9, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/bank-of-baroda-fd-rates/6', image: 'bob-Photoroom_oqoj67' },
              { name: 'Bajaj Finance Ltd.', code: 'Bajaj FD', return: 7.8, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/bajaj-finance-ltd-fd-rates/1', image: 'fd_partner_bajaj_new_uiiysp' },
              { name: 'State Bank of India', code: 'SBI FD', return: 5.6, icon: '₹', link: 'https://www.etmoney.com/fixed-deposit/sbi-bank-fd-rates/2', image: 'sbi_wugpsu' }
            ]
          },
          {
            type: 'Mutual Funds',
            items: [
              { name: 'HDFC Bluechip', code: 'Direct-Growth', return: 15.82, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/hdfc-balanced-advantage-fund-direct-plan-growth/15622', image: 'hdfc_mf_ixtwmi' },
              { name: 'Aditya Birla Sun Life', code: 'Direct-Growth', return: 9.58, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/aditya-birla-sun-life-medium-term-plan-direct-growth/15477', image: 'aditya_birla_arlswk' },
              { name: 'Quant Multi Asset', code: 'Direct-Growth', return: 16.25, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/quant-multi-asset-fund-direct-growth/16918', image: 'quant_hcnfdx' },
              { name: 'ICICI Prudential', code: 'Direct-Growth', return: 18.3, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/icici-prudential-infrastructure-direct-growth/15416', image: 'icici_yzot5k' },
              { name: 'HSBC Value Fund', code: 'Direct-Growth', return: 21.28, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/hsbc-value-fund-direct-growth/15836', image: 'hsbc_ffoui0' },
              { name: 'UTI Short Duration', code: 'Direct-Growth', return: 7.42, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/uti-short-duration-direct-growth/16611', image: 'uti_n4psc1' },
              { name: 'LIC Arbitrage Fund', code: 'Direct-Growth', return: 5.71, icon: '₹',link : 'https://www.etmoney.com/mutual-funds/lic-mf-arbitrage-fund-direct-growth/39181', image: 'lic_rp71bg' },
            ]
          },
          {
            
            type: 'Investment Videos',
            items: [
              { 
                id : 0,
                details : ('https://youtu.be/fiLVHI8CUZE?si=5fsPZh713j1OsKhP')
              },{ 
                id : 1,
                details : ('https://youtu.be/7c4ZJ-ljRMw?si=RfoeTdPrI1xqrSTA')
              },{
                id : 2,
                details : ('https://youtu.be/-FP7IVNN4bI?si=tF6yy1r7ZsyAxd5b')
              },{ 
                id : 3,
                details : ('https://youtu.be/7jvTrxh0kGc?si=xOKMXSjHdb-oaw-X')
              },{
                id : 4,
                details : ('https://youtu.be/raW2FIPnqIc?si=yGUBkLsnZgYuByhu')
              },{
                id : 5,
                details: ('https://www.youtube.com/watch?v=lqk2LppTl84&t=228s')
              },{
                id : 6,
                details: ('https://youtu.be/Q0uXGQu55GM?si=B15Ob4M-WdtP0Sag')
              }
            ]
          }
      ];
      
    return  (
        <div 
        className="inset-0 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90 text-white p-4 overflow-hidden w-full " 
        style={{ justifyContent: 'center', alignItems: 'center', margin: 'auto' }}
        >
          
          <div 
            className="grid grid-cols-2 gap-4 mb-6 pb-2 overflow-hidden" style={{marginTop:'90px',marginBottom:'40px'}}
            >
            {personalizeButtons.map((button) => (
                <div key={button.name} className="relative group transform transition-all duration-500 hover:scale-100">
                    <button onClick={() => setActiveButton(button.name)} className={`w-full bg-white/15 backdrop-blur-lg rounded-2xl p-2 md:p-6 flex flex-col justify-center items-center text-center relative z-10 overflow-hidden min-h-[90px] hover:h-[80px] ${activeButton === button.name ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/90 text-white' : 'bg-gradient-to-br from-blue-900/90 to-purple-900/50 text-gray-300'}`}>
                        <span className="flex items-center justify-center text-sm font-medium mx-auto relative z-10 transition-all duration-300 mb-2">
                            <span className="flex transition-transform duration-300 group-hover:scale-125 inline-block mr-2">
                                {button.icon}&nbsp;&nbsp;{button.name}
                            </span>
                        </span>
                        <div 
                          className="w-full text-white text-xs text-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-full transition-all duration-300 z-20 absolute bottom-0 left-0 pb-2 hidden lg:block"
                        >
                          {button.title}
                        </div>
                    </button>
                </div>
            ))}
          </div>
    
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Top Investments & Learning
          </h2>
    
          {investments.map((category, categoryIndex) => (
            <div key={category.type} className="mb-6" style={{ userSelect: 'none' }}>
              <style>
                {`
                  ::-webkit-scrollbar {
                    width: 2px;
                    height: 2px;
                  }
                  ::-webkit-scrollbar:horizontal {
                    width: 2px;
                    height: 2px;
                  }
                  
                  ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom right, rgba(0, 0, 255, 0.9), rgba(128, 0, 128, 0.9)); /* Gradient from blue to purple */
                    border-radius: 3px;
                  }
            
                  ::-webkit-scrollbar-thumb:hover {
                    background-color: #666; 
                  }
            
                  ::-webkit-scrollbar-track {
                    background-color: linear-gradient(to bottom right, rgba(0, 0, 255, 0.9), rgba(128, 0, 128, 0.9)); /* Gradient from blue to purple */
                    border-radius: 3px;
                  }
                `}
              </style>
              <h3 className="text-lg font-semibold mb-3 text-bg-gradient-to-br from-blue-900/90 to-purple-900/50">{category.type}</h3>
              
              <div 
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide whitespace-nowrap scroll-smooth overflow-hidden"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {category.items.map((investment, index) => {

                  const bgIntensity = Math.max(700 - (index * 50), 800);

                  const img = cld.image(investment.image)
                    .format('auto')
                    .quality('auto')
                    .resize(auto().gravity(autoGravity()).width(500).height(500));
                  
                  return category.type === 'Investment Videos' && videoDetails && videoDetails[investment.id] ? (
                      <div
                        key={videoDetails[investment.id].name}
                        className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-900/90 to-purple-900/90-${bgIntensity} rounded-lg p-4 
                          transform transition-all duration-300 
                          hover:scale-105 hover:shadow-lg
                          scroll-snap-align: start;`}
                      >
                        <div className="relative mb-3">
                          <img
                            src={videoDetails[investment.id].thumbnail}
                            alt={videoDetails[investment.id].name}
                            onClick={() => window.open(videoDetails[investment.id].videoUrl, '_blank')}
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 rounded">
                            {videoDetails[investment.id].duration}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg line-clamp-2">{videoDetails[investment.id].name}</h4>
                          <p className="text-sm text-gray-300">{videoDetails[investment.id].views} views</p>
                        </div>
                      </div>
                    ) : category.type === 'Mutual Funds' ?  (
                      <div 
                      key={investment.code || investment.name} 
                      className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg
                        scroll-snap-align: start;`}
                        onClick={() => window.open(investment.link, '_blank')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">{investment.name}</h4>
                            <div className="flex space-x-2">
                              <p className="text-sm text-gray-400">{investment.code}</p>
                              <p className="text-sm text-gray-400">( {investment.return}% )</p>
                            </div>
                        </div>
                          <AdvancedImage 
                            className="w-11 h-11 rounded-full object-cover" 
                            cldImg={img} 
                          />
                        
                      </div>
                    </div>
                  )
                 : category.type === 'Fixed Deposits' ?  (
                    <div 
                      key={investment.code || investment.name} 
                      className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                        transform transition-all duration-300 
                        hover:scale-105 hover:shadow-lg
                        scroll-snap-align: start;`}
                        onClick={() => window.open(investment.link, '_blank')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">{investment.name}</h4>
                            <div className="flex space-x-2">
                              <p className="text-sm text-gray-400">{investment.code}</p>
                              <p className="text-sm text-gray-400">( {investment.return}% )</p>
                            </div>
                        </div>
                        <AdvancedImage 
                            className="w-11 h-11 rounded-full object-cover" 
                            cldImg={img} 
                          />
                      </div>
                    </div>
                  ) : <div 
                  key={investment.code || investment.name} 
                  className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-1500/90 to-purple-1500/90${bgIntensity} rounded-lg p-4 
                    transform transition-all duration-300 
                    hover:scale-105 hover:shadow-lg
                    scroll-snap-align: start;`}
                  onClick={() => window.open(investment.link, '_blank')}
              >
                  <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                          <h4 className="font-bold text-lg leading-tight">{investment.name}</h4>
                          <div className="flex space-x-2">
                              <p className="text-sm text-gray-400">{investment.code}</p>
                              <p className="text-sm text-gray-400">( {investment.icon}{investment.price} )</p>
                          </div>
                      </div>
                      <AdvancedImage
                        className="w-11 h-11 rounded-full object-cover"
                        cldImg={img}
                      />
                  </div>
              </div>; }) }
              </div>
            </div>
          ))}
        </div>
      );
      };
      

      

  const [isLoading, setIsLoading] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); 
  const messagesEndRef = useRef(null);

  const generateFinancialResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('invest')) {
      return "Great question! Consider diversifying your portfolio across different asset classes. Index funds and ETFs can be good starting points for most investors.";
    } else if (lowercaseInput.includes('savings')) {
      return "For savings, aim to build an emergency fund covering 3-6 months of expenses. Look into high-yield savings accounts to earn better interest.";
    } else if (lowercaseInput.includes('retirement')) {
      return "For retirement planning, maximize contributions to tax-advantaged accounts like 401(k) and IRAs. The earlier you start, the more you can benefit from compound interest.";
    } else if (lowercaseInput.includes('debt')) {
      return "When managing debt, prioritize high-interest debt first. Consider the debt avalanche method: pay minimums on all debts, then put extra money towards the highest interest debt.";
    } else {
      return "I can help with investment, savings, retirement, and debt questions. What specific financial advice are you looking for?";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length,
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);


    setTimeout(() => {
      const botResponse = {
        id: messages.length + 1,
        text: generateFinancialResponse(input),
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 1 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      <div className=' bg-gradient-to-br from-blue-900/50 to-purple-900/50 ' >
        <Navbar mail={mail}/>

      <StocksData/>

      </div>
    </motion.div>

  );
};

export default Home;
