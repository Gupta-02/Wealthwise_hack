import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Users, TrendingUp, Wallet, Coins, ChevronRight, ArrowUp } from 'lucide-react';
import Cookies from 'js-cookie';
import Navbar from './navbar';

const InvestmentRecommendationForm = ({mail}) => {
    function formatChatbotResponse(response) {
        return response
          .replace(/\n/g, '<br>') 
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    }

    const [formData, setFormData] = useState({
        user_age: '',
        user_risk_appetite: '',
        user_income: '',
        user_savings: '',
        user_investment_amount: ''
    });
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRecommendation(null);

        try {
            const getCookie = Cookies.get('sessionToken');
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}recommend-mutual-funds`, 
                formData,
                {
                    headers: {
                      Authorization: `Bearer ${getCookie}`,
                      'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                  }
            );
            setRecommendation(response.data);
            
            setTimeout(() => {
                const recommendationElement = document.getElementById('recommendation-section');
                if (recommendationElement) {
                    recommendationElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 500);
        } catch (error) {
            console.error('Error fetching recommendation:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1, 
            y: 0,
            transition: {
                delay: custom * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        })
    };

    return (
    <>

        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 z-50 bg-green-500/30"
            style={{ scaleX }}
        />

        {scrollYProgress > 0.2 && (
            <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 bg-green-500/80 text-white p-3 rounded-full shadow-2xl z-50 hover:bg-green-600 transition-colors"
            >
                <ArrowUp />
            </motion.button>
        )}

        <Navbar mail={mail}/>
        <div 
            ref={scrollRef}
            className="min-h-screen bg-gradient-to-br from-indigo-900/70 to-purple-900/70 flex items-center justify-center p-4"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                }}
                className="w-full max-w-2xl bg-white/15 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
		style={{marginTop:'90px'}}
            >
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-6 text-white text-center"
                >
                    Investment Recommendation
                </motion.h2>
                
                

                {recommendation && (
                    <motion.div 
                        id="recommendation-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="mt-6 bg-white/10 rounded-xl p-6 text-white"
                    >
                        <motion.h3 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-bold mb-4"
                        >
                            Personalized Recommendation
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="whitespace-pre-wrap" 
                            dangerouslySetInnerHTML={{
                                __html: formatChatbotResponse(recommendation.groqRecommendation)
                            }}
                        ></motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    </>
    );
};

export default InvestmentRecommendationForm;
