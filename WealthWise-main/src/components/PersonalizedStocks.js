import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
    TrendingUp , 
    ShieldAlert, 
    ChevronRight, 
    ArrowUp, 
    Clock 
} from 'lucide-react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Cookies from 'js-cookie';
import Navbar from './navbar';

const PersonalizedStocks = ({mail}) => {
    function formatChatbotResponse(response) {
        return response
          .replace(/\n/g, '<br>') 
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    }

    const [formData, setFormData] = useState({
        initial_capital : '',
        risk_tolerance: '',
        trading_strategy_preference: ''
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
                `${process.env.REACT_APP_BACKEND_URL}PersonalizedStocks`, 
                {"formData":formData},
                {
                    headers: {
                        Authorization: `Bearer ${getCookie}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            setRecommendation(response.data.answer.received);
            
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

        
    </>
    );
};

export default PersonalizedStocks;
