import react ,{useState,useEffect} from "react";
import Navbar from "./navbar";
import ExpenseComparison from "./ExpenseComparison";
import BudgetPieChart from "./BudgetPieChart";
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';


const ExpenseTracker = () => {
    const location = useLocation();
    const { data, mail } = location.state || {}; 
    const [recommendation,srtrecommendation]=useState("");
    function formatChatbotResponse(response) {
        return response
          .replace(/\n/g, '<br>') 
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
    }

    return ( 
        <>
        <div className="relative bg-gradient-to-br 
                from-blue-600/90 
                to-purple-600/90 
                "> <Navbar mail={mail}/></div>
        
        <div className="
            min-h-screen 
            w-full 
            bg-gradient-to-br 
            from-blue-600/90 
            to-purple-600/90 
            overflow-x-hidden
            flex-row 
            items-center 
            justify-center
            "
        >
            <ExpenseComparison data={data} mail={mail} props ={srtrecommendation}/>
            <BudgetPieChart data={data}/>
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
                        className="w-full max-w-6xl mx-auto p-4 mt-6 mb-6 bg-white/10 rounded-xl p-6 text-white"
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
                                __html: formatChatbotResponse(recommendation.llmres)
                            }}
                        ></motion.p>
                    </motion.div>
                )}
        </div>
       
        
        </>
     );
}
 
export default ExpenseTracker;
