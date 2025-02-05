import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const PageNotFound = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const glowStyle = {
    position: 'absolute',
    top: mousePosition.y,
    left: mousePosition.x,
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(37, 117, 252, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 1
  };

  const home = () => {
    navigate("/home");
  };

  return (
    <motion.div 
      ref={containerRef}
      className="page-not-found-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={glowStyle} />

      <motion.div 
        className="page-not-found-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 10 
        }}
      >
        <div className="error-content">
          <motion.div 
            className="error-code"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              4
            </motion.span>
            <div className="error-divider">
              <motion.svg 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
            </div>
            <motion.span 
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              4
            </motion.span>
          </motion.div>
          
          <motion.h1 
            className="error-title"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Lost in the Digital Wilderness
          </motion.h1>
          
          <motion.p 
            className="error-description"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            The page you're looking for has disappeared into the void. 
            Let's find our way back to safety.
          </motion.p>
          
          <motion.button 
            className="explore-button"
            onClick={home}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Explore Home
            <motion.div 
              className="button-icon"
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page-not-found-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(
            135deg, 
            #121212 0%, 
            #1e1e1e 50%, 
            #2a2a2a 100%
          );
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
          perspective: 1000px;
        }

        .page-not-found-container {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 50px;
          max-width: 600px;
          width: 100%;
          box-shadow: 
            0 15px 35px rgba(0, 0, 0, 0.2),
            0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .error-content {
          text-align: center;
          color: #ffffff;
          position: relative;
        }

        .error-code {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-bottom: 30px;
        }

        .error-code > span {
          font-size: 120px;
          font-weight: 700;
          color: transparent;
          background: linear-gradient(
            135deg, 
            #6a11cb 0%, 
            #2575fc 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          line-height: 1;
        }

        .error-divider {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #ff6b6b;
        }

        .error-divider svg {
          width: 60px;
          height: 60px;
          stroke: currentColor;
        }

        .error-title {
          font-size: 36px;
          margin-bottom: 20px;
          background: linear-gradient(
            135deg, 
            #6a11cb 0%, 
            #2575fc 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        .error-description {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .explore-button {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          padding: 15px 30px;
          background: linear-gradient(
            135deg, 
            #6a11cb 0%, 
            #2575fc 100%
          );
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .button-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .page-not-found-container {
            margin: 0 20px;
            padding: 30px;
          }

          .error-code > span {
            font-size: 80px;
          }

          .error-divider {
            width: 70px;
            height: 70px;
          }

          .error-title {
            font-size: 28px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default PageNotFound;
