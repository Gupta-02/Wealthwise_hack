import React, { useState, useEffect } from "react";
import Navbar from './navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const ExpenseDate = ({ mail }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0); 
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const getCookie = Cookies.get('sessionToken');
      
      if (!getCookie) {
        navigate('/');
      }

      const [responseData, findEmailResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}getData`, { 
          params: { "email": mail },
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}findmail?email=${encodeURIComponent(mail)}`, {
          headers: {
            Authorization: `Bearer ${getCookie}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
      ]);

      setCount(findEmailResponse.data.count || 0);
      setData(responseData.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setCount(0);
      setData([]);
    }
  };

  useEffect(() => {
    if (mail) {
      fetchData();
    }
  }, [mail]);

  const handlePlusClick = () => {
    navigate('/foam');
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
        relative
      ">
        <div 
          className="
            container 
            mx-auto 
            px-4 
            py-12 
            md:px-8 
            lg:px-16
          "
          style={{ marginTop: data.length > 5 ? '90px' : '0px' }}
        >
          <div className={data.length < 6 && window.innerWidth > 600
          ? "flex flex-row justify-center items-center gap-4 md:gap-6 lg:gap-8"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
        }>
            {data.map((dateItem, index) => {
              const date = new Date(dateItem.date.slice(0,10));         
              return (
                <div 
                  key={index} 
                  className="
                    w-full 
                    bg-white/15 
                    backdrop-blur-lg 
                    rounded-2xl 
                    p-4 
                    md:p-6 
                    flex 
                    flex-col 
                    justify-center 
                    items-center 
                    text-center 
                    transform 
                    transition-all 
                    duration-500 
                    hover:scale-105 
                    hover:shadow-2xl
                    shadow-lg
                    border 
                    border-white/20
                    group
                    relative 
                    overflow-hidden
                    cursor-pointer
                  "
                  onClick={() => {navigate('/expenseTracker',{state: {data: dateItem, mail: mail}}) }}
                >
                  <div className="
                    text-4xl 
                    md:text-5xl 
                    lg:text-6xl 
                    font-bold 
                    text-white 
                    mb-2
                    drop-shadow-lg
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:-translate-y-2
                  ">
                    {date.getDate()}
                  </div>
                  
                  <div className="
                    text-sm 
                    md:text-base 
                    font-medium 
                    text-white/80 
                    uppercase 
                    tracking-wider
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:scale-105
                  ">
                    {date.toLocaleString('default', { month: 'short' })} {date.getFullYear()}
                  </div>
                  
                  <div className="
                    text-xs 
                    md:text-sm 
                    text-white/70 
                    mt-1
                    mb-3
                    relative
                    z-10
                    transform 
                    transition-transform 
                    group-hover:scale-105
                  ">
                    {date.toLocaleString('default', { weekday: 'long' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {count === 0 && (
          <button 
            onClick={handlePlusClick}
            className="
              fixed 
              bottom-8 
              right-8 
              bg-blue-500 
              text-white 
              rounded-full 
              w-16 
              h-16 
              flex 
              items-center 
              justify-center 
              shadow-2xl 
              hover:bg-blue-600 
              transition-all 
              duration-300 
              z-50
            "
          >
            <PlusIcon size={32} />
          </button>
        )}
      </div>
    </>
  );
};

export default ExpenseDate;
