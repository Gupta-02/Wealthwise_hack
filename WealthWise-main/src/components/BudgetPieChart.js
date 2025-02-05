import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

import { 
    Wallet, 
    Home, 
    Car, 
    Utensils, 
    Stethoscope, 
    Lightbulb, 
    BookOpen, 
    ShoppingBag, 
    MoreHorizontal 
} from 'lucide-react';

const COLOR_PALETTE = [
    { 
        fill: '#FFD700',  
        gradient: 'from-red-500 to-red-600',
        icon: Utensils
    },
    { 
        fill: '#E08B00', 
        gradient: 'from-green-500 to-green-600',
        icon: ShoppingBag
    },
    { 
        fill: '#00A8E7', 
        gradient: 'from-blue-500 to-blue-600',
        icon: Home
    },
    { 
        fill: '#0073DC', 
        gradient: 'from-yellow-500 to-yellow-600',
        icon: Car
    },
    { 
        fill: '#EF6D6E', 
        gradient: 'from-rose-500 to-rose-600',
        icon: Stethoscope
    },
    { 
        fill: '#A680E7',  
        gradient: 'from-purple-500 to-purple-600',
        icon: Wallet
    },
    { 
        fill: '#B06D00',  
        gradient: 'from-teal-500 to-teal-600',
        icon: Lightbulb
    },
    { 
        fill: '#CDBBFF', 
        gradient: 'from-orange-500 to-orange-600',
        icon: BookOpen
    },
    { 
        fill: '#EC3B91',  
        gradient: 'from-emerald-500 to-emerald-600',
        icon: MoreHorizontal
    },
    { 
        fill: '#FFA9C6',  
        gradient: 'from-gray-500 to-gray-600',
        icon: BookOpen
    },
    { 
        fill: '#FF9875', 
        gradient: 'from-orange-600 to-orange-700',
        icon: ShoppingBag
    },
    { 
        fill: '#CB763C',  
        gradient: 'from-gray-400 to-gray-500',
        icon: MoreHorizontal
    },
    { 
        fill: '#A2D39C',  
        gradient: 'from-gray-200 to-gray-300',
        icon: MoreHorizontal
    },
    { 
        fill: '#8FA3BF',  
        gradient: 'from-blue-gray-500 to-blue-gray-600',
        icon: MoreHorizontal
    }
];

const CATEGORY_DESCRIPTIONS = {
    'Food at Home': 'Groceries and home-cooked meals - essential daily expenses',
    'Food Away From Home': 'Restaurants, takeout, and dining experiences',
    'Housing': 'Rent, mortgage, utilities, and home maintenance',
    'Transportation': 'Fuel, public transit, car expenses, and commuting',
    'Healthcare': 'Medical treatments, insurance, wellness expenses',
    'Personal Finance': 'Investments, financial services, and planning',
    'Savings': 'Emergency fund, retirement, and long-term financial goals',
    'Entertainment': 'Leisure activities, streaming, hobbies',
    'Personal Care': 'Grooming, wellness, self-improvement',
    'Education': 'Courses, books, professional development',
    'Apparel and Services': 'Clothing, personal accessories, and related services',
    'Tobacco Products': 'Cigarettes, cigars, and other tobacco-related expenses',
    'Alcoholic Beverages': 'Beer, wine, spirits, and other alcohol-related purchases',
    'Other Expenses': 'Miscellaneous and unexpected costs'
};


const categoryMapping = {
    foodAtHome: "Food at Home",
    foodAwayFromHome: "Food Away From Home",
    housing: "Housing",
    transportation: "Transportation",
    healthcare: "Healthcare",
    personalfinance: "Personal Finance",
    entertainment: "Entertainment",
    personalCare: "Personal Care",
    education: "Education",
    apparelAndServices: "Apparel and Services",
    tobaccoProducts: "Tobacco Products",
    alcoholicBeverages: "Alcoholic Beverages",
    others: "Other Expenses",
  };

const BudgetPieChart = ({ 
    expenses ,
    title = "Monthly Budget Breakdown",
    data
}) => {
    const defaultExpenses = Object.keys(categoryMapping).map((key) => ({
        name: categoryMapping[key],
        value: parseFloat(data[key]) || 0,
      }));
      expenses= defaultExpenses;
    console.log("data pie chart : ",data);

    const [activeIndex, setActiveIndex] = useState(null);

    const processedData = useMemo(() => {
        return expenses
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [expenses]);

    const totalExpenses = useMemo(() => 
        processedData.reduce((sum, item) => sum + item.value, 0),
        [processedData]
    );
    

    const chartData = processedData.length > 0 ? processedData : defaultExpenses;

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-bold drop-shadow-md"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className='w-full max-w-6xl mx-auto p-4' style={{marginBottom:'40px'}} >
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className=" rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">
                        {title}
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Pie Chart */}
                    <div className=" w-full md:w-2/3 h-[500px] p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius="80%"
                                    dataKey="value"
                                    activeIndex={activeIndex}
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    {chartData.map((entry, index) => {
                                        const paletteItem = COLOR_PALETTE[index % COLOR_PALETTE.length];
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={paletteItem.fill}
                                                className={`transition-all duration-300 ${
                                                    activeIndex !== null && activeIndex !== index 
                                                    ? 'opacity-50' 
                                                    : 'opacity-100'
                                                }`}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip 
                                    content={({ payload }) => {
                                        if (!payload || payload.length === 0) return null;
                                        const data = payload[0].payload;
                                        const category = data.name;
                                        const paletteItem = COLOR_PALETTE.find(
                                            (item, index) => chartData[index]?.name === category
                                        ) || COLOR_PALETTE[0];
                                        const CategoryIcon = paletteItem.icon;

                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                                            >
                                                <div className="flex items-center mb-2">
                                                    <CategoryIcon className="mr-2" style={{ color: paletteItem.fill }} size={24} />
                                                    <p className="font-bold text-gray-800">{category}</p>
                                                </div>
                                                <p className="text-gray-600">
                                                    ₹{data.value.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {CATEGORY_DESCRIPTIONS[category] || 'No description available'}
                                                </p>
                                            </motion.div>
                                        );
                                    }}
                                />
                                <Legend 
                                    iconType="circle"
                                    layout="vertical" 
                                    verticalAlign="middle" 
                                    align="right"
                                    formatter={(value, entry, index) => {
                                        const color = COLOR_PALETTE[index % COLOR_PALETTE.length].fill;
                                        return (
                                            <span 
                                                className="text-gray-700 font-medium" 
                                                style={{ color }}
                                            >
                                                {value}
                                            </span>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Insights Panel */}
                    <div className="w-full md:w-1/3 p-6">
                        <div className="space-y-4 h-max" >
                            <div className="bg-white/30 rounded-xl shadow-md p-4 lg:mt-16 mt-0">
                                <div className="flex justify-between items-center "  >
                                    <span className="text-gray-100">Total Expenses</span>
                                    <Wallet className="text-blue-500" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    ₹{totalExpenses.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/30 rounded-xl shadow-md p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-100">Top Expense</span>
                                    <Home className="text-green-500" size={24} />
                                </div>
                                <p className="text-xl font-bold text-white">
                                    {chartData[0]?.name}
                                </p>
                                <p className="text-gray-100">
                                    ₹{chartData[0]?.value.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/30 rounded-xl shadow-md p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-100">Categories</span>
                                    <MoreHorizontal className="text-purple-500" size={24} />
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {chartData.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </motion.div>
        </div>
    );
};

export default BudgetPieChart;
