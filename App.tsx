import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import EnhancedNavbar from './src/components/EnhancedNavbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import { ToastProvider, usePerformanceMonitor } from './src/components/AdvancedUIComponents';
import CRMAdmin from './pages/CRMAdmin';
import { WhatsAppFloater } from './src/components/WhatsAppFloater';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Monitor performance
  usePerformanceMonitor();

  // Show loading screen on every home page load/refresh
  useEffect(() => {
    const isHomePage = location.pathname === '/' || location.pathname === '' || location.pathname === '/#/';
    
    if (isHomePage) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" onComplete={() => setLoading(false)} />
      ) : (
        <Routes>
          {/* Admin route - no navbar/footer */}
          <Route path="/admin" element={<CRMAdmin />} />
          
          {/* Regular routes with navbar/footer */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col relative bg-[#fdfbf7]">
              <EnhancedNavbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
              
              {/* WhatsApp Floater - appears on all pages except admin */}
              <WhatsAppFloater 
                position="bottom-left"
                offset={{ x: 20, y: 20 }}
                showDelay={4000}
                hideOnScroll={false}
              />
            </div>
          } />
        </Routes>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ToastProvider>
  );
};

export default App;