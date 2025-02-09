import React, { useState ,useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import axios from 'axios';
import Cookies from 'js-cookie';

const ExpenseComparison = ({ data, mail,props }) => {
  const [analysisdata, setAnalysisdata] = useState(null);
  const [averageExpenses, setAverageExpenses] = useState({});
  const [userExpenses, setUserExpenses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async (expenses) => {
    try {
      setIsLoading(true);
      const getCookie = Cookies.get('sessionToken');
      if (!getCookie) {
        return navigate('/');
      }

      const resdata = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}getAnalysis`,
        {
          salary: data.income,
          age: data.age,
          cityType: data.city,
          userExpenses: expenses,
          data:data
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setAnalysisdata(resdata.data.resopnse);
      props(resdata.data.resopnse);

      // Set average expenses after fetching analysis data
      const report = resdata.data.resopnse.report.expensesComparison;
      setAverageExpenses({
        "Food at Home": report.foodAtHome.benchmark,
        "Food Away From Home": report.foodAwayFromHome.benchmark,
        "Housing": report.housing.benchmark,
        "Transportation": report.transportation.benchmark,
        "Healthcare": report.healthCare.benchmark,
        "Education": report.education.benchmark,
        "Entertainment": report.entertainment.benchmark,
        "Personal Care": report.personalCare.benchmark,
        "Alcoholic Beverages": report.alcoholicBeverages.benchmark,
        "Tobacco Products": report.tobacco.benchmark,
        "Personal Finance": report.personalCare.benchmark,
        "Savings": report.savings.benchmark,
        "Apparel and Services": report.apparelAndServices.benchmark,
        "Other Expenses": report.other.benchmark,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      const expenses = {
        foodAtHome: parseInt(data.foodAtHome, 10),
        foodAwayFromHome: parseInt(data.foodAwayFromHome, 10),
        alcoholicBeverages: parseInt(data.alcoholicBeverages, 10),
        housing: parseInt(data.housing, 10),
        apparelAndServices: parseInt(data.apparelAndServices, 10),
        transportation: parseInt(data.transportation, 10),
        healthCare: parseInt(data.healthcare, 10),
        entertainment: parseInt(data.entertainment, 10),
        personalCare: parseInt(data.personalCare, 10),
        education: parseInt(data.education, 10),
        tobacco: parseInt(data.tobaccoProducts, 10),
        other: parseInt(data.others, 10),
        personalFinanceAndPensions: parseInt(data.personalfinance, 10),
        savings: parseInt(data.savings, 10),
      };
      setUserExpenses(expenses);
      fetchData(expenses);
    }
  }, [data]); 

  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryMapping = {
    foodAtHome: "Food at Home",
    foodAwayFromHome: "Food Away From Home",
    housing: "Housing",
    transportation: "Transportation",
    healthcare: "Healthcare",
    personalfinance: "Personal Finance",
    savings: "Savings",
    entertainment: "Entertainment",
    personalCare: "Personal Care",
    education: "Education",
    apparelAndServices: "Apparel and Services",
    tobaccoProducts: "Tobacco Products",
    alcoholicBeverages: "Alcoholic Beverages",
    others: "Other Expenses",
  };


  const expenses = Object.keys(categoryMapping).map((key) => ({
    category: categoryMapping[key],
    amount: parseFloat(data[key]) || 0,
  }));



  const userExpensesByCategory = {};
  expenses.forEach(expense => {
    userExpensesByCategory[expense.category] = (userExpensesByCategory[expense.category] || 0) + expense.amount;
  });

  const data1 = Object.keys(averageExpenses).map(category => ({
    category,
    'Your Expenses': userExpensesByCategory[category] || 0,
    'Average Expenses': averageExpenses[category],
    difference: ((userExpensesByCategory[category] || 0) - averageExpenses[category])
  }));

  const formatCurrency = (value) => {
    if (window.innerWidth < 600) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return `Rs.${value.toLocaleString()}`;
    }
  };
  


  const formatXAxisLabel = (label) => {
    return label
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <>
        <Navbar mail={mail}/>
        <div className="
          min-h-screen 
          w-full 
          bg-gradient-to-br 
          from-blue-600/90 
          to-purple-600/90 
          overflow-x-hidden
          flex 
          items-center 
          justify-center
        ">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-16 h-16 border-4 border-white border-t-transparent border-opacity-50 rounded-full">
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className='w-full max-w-6xl mx-auto p-4' style={{marginTop:'90px',marginBottom:'30px'}}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="w-full max-w-6xl  rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-white text-center tracking-tight"
          >
            Expense Breakdown Comparison
          </motion.h1>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8 p-8">
          {/* Bar Chart */}
           <div className="md:col-span-2 min-h-[450px] max-h-[740px] flex items-center justify-center md:mt-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data1}
                margin={{ top: 20, right: 10, left: 10, bottom: 40 }} 
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    const categoryIndex = state.activeTooltipIndex;
                    setSelectedCategory(data1[categoryIndex]?.category);
                  }
                }}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <CartesianGrid 
                  stroke="#e6e6e6" 
                  strokeDasharray="3 3" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="category" 
                  angle={window.innerWidth < 600 ? -90 : -45}
                  textAnchor="end"
                  interval={0}
                  tick={{ 
                    fill: 'white', 
                    fontSize: '0.75rem', 
                    fontWeight: 600 
                  }}
                  tickFormatter={formatXAxisLabel}
                  height={80} 
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  tick={{ fill: 'white' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    color:'white'
                     
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  wrapperStyle={{ color: "#FFFFFF" }} 
                  height={36}
                />
                <Bar 
                  dataKey="Your Expenses"
                  fill="#10B981"
       
                  barSize={40}
                  opacity={selectedCategory === null ? 1 : 0.3}
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="Average Expenses" 
                  fill="#F43F5E"
                  barSize={40}
                  opacity={selectedCategory === null ? 1 : 0.3}
                  animationBegin={500}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-100"
            >
              Key Insights
            </motion.h2>
            <AnimatePresence>
              {data1.map((item, index) => {
                const difference = item['Your Expenses'] - item['Average Expenses'];
                const percentDiff = ((difference / item['Average Expenses']) * 100).toFixed(1);
                const isHigher = difference > 0;

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/30  rounded-xl shadow-md p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-100">
                        {formatXAxisLabel(item.category)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isHigher ? (
                          <TrendingUpIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDownIcon className="w-5 h-5 text-red-400" />
                        )}
                        <span 
                          className={`font-bold ${
                            isHigher ? 'text-green-500' : 'text-red-400'
                          }`}
                        >
                          {isHigher ? '+' : '-'}{Math.abs(percentDiff)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseComparison;
