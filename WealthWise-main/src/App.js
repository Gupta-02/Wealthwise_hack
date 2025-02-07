import React, { useState, useEffect } from 'react';
import { Routes, Route ,useNavigate} from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import { auth} from "./firebase";
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Wallet, Users } from 'lucide-react';
import HashLoader from "react-spinners/HashLoader";
import Psinfo from './components/Psinfo';
import ChatBot from './components/ChatBot';
import FileUpload from './components/FileUpload';
import InvestmentRecommendationForm from './components/personalMF';
import PageNotFound from './components/PageNotFound';
import PersonalFDRecommendation from './components/personalFD';
import ExpenseDate from './components/ExpenseDate';
import ExpenseTracker from './components/ExpenseTracker';
import PersonalizedStocks from './components/PersonalizedStocks';
const App = () => {
  const [log, setLog] = useState(false);
  const [mail, setMail] = useState(localStorage.getItem('userEmail') || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    try {
      setLoading(true);
        if (user) {
          setMail(user.email);
          localStorage.setItem("userEmail", user.email); 
        } else {
          setMail('');
          localStorage.removeItem("userEmail");
          await auth.signOut();
        }
        setLoading(false);
      } catch (error) {
        console.error('Error during authentication state change:', error);
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setMail(storedEmail);
    }
  }, []);

  const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            y: 20, 
            opacity: 0,
            scale: 0.8
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    const spinVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const iconList = [
        { icon: <Coins className="text-blue-400 w-12 h-12" />, color: "bg-blue-500/10" },
        { icon: <TrendingUp className="text-green-400 w-12 h-12" />, color: "bg-green-500/10" },
        { icon: <Wallet className="text-purple-400 w-12 h-12" />, color: "bg-purple-500/10" },
        { icon: <Users className="text-indigo-400 w-12 h-12" />, color: "bg-indigo-500/10" }
    ];




  if (loading) {
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900/70 to-purple-900/70 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                }}
                className="w-full max-w-md bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 text-center"
            >
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-6 text-white"
                >
                    Generating Recommendation
                </motion.h2>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center space-x-4 mb-6"
                >
                    {[1, 2, 3, 4].map((_, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`w-4 h-4 rounded-full ${iconList[index].color}`}
                        />
                    ))}
                </motion.div>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center space-x-4 mb-6"
                >
                    {iconList.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            animate="animate"
                            className={`p-4 rounded-xl ${item.color} flex items-center justify-center`}
                        >
                            {item.icon}
                        </motion.div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                            delay: 0.5
                        }
                    }}
                    className="text-white/70 text-lg"
                >
                    Analyzing your financial profile...
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        transition: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
                />
            </motion.div>
        </div>
    );
  }



  return (
    <div className="App">
      <style>
        {`
            .grecaptcha-badge {
            visibility: hidden;
            }
        `}
      </style>
      <Routes>
        <Route path="/" element={<Login user1={setLog} email={setMail} />} />
        <Route path="*" element={ mail!=='' ? <PageNotFound /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/home" element={ mail!=='' ? <Home mail={mail} /> : <Login user1={setLog} email={setMail} /> } />
        <Route path="/foam" element={  mail!=='' ?<Psinfo mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/chatbot" element={ mail!=='' ?<ChatBot mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/fileupload" element={ mail!=='' && (mail === 'anuragnarsingoju@gmail.com' || mail === 'nagasaipraneeth5@gmail.com' || mail === 'aashish17405@gmail.com' || mail === 'abhigxtheupm@gmail.com' ) ? <FileUpload mail={mail} /> : <PageNotFound />} />
        <Route path="/personal-MF" element={  mail!=='' ?<InvestmentRecommendationForm mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/fd-recommendations" element={ mail!=='' ? <PersonalFDRecommendation mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/expensedate" element={ mail!=='' ? <ExpenseDate mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/expenseTracker" element={ mail!=='' ? <ExpenseTracker mail={mail} /> : <Login user1={setLog} email={setMail} />} />
        <Route path="/PersonalizedStocks" element={ mail!=='' ? <PersonalizedStocks mail={mail} /> : <Login user1={setLog} email={setMail} />} />


      </Routes>
    </div>
  );
};

export default App;
