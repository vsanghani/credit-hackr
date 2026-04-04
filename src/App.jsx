import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CardDetail from './pages/CardDetail'
import HackrCalculator from './pages/HackrCalculator'
import Footer from './components/Footer'
import MeshBackground from './components/MeshBackground'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import CardsPage from './pages/CardsPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfUse from './pages/TermsOfUse'
import CookieConsent from './components/CookieConsent'
import ScrollToTop from './components/ScrollToTop'
import { CardsProvider } from './context/CardsContext'
import './App.css'

function App() {
    return (
        <CardsProvider>
            <Router>
                <ScrollToTop />
                <div className="app-container">
                    <MeshBackground />
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/cards" element={<CardsPage />} />
                            <Route path="/cards/:id" element={<CardDetail />} />
                            <Route path="/hackr" element={<HackrCalculator />} />
                            <Route path="/blog" element={<BlogList />} />
                            <Route path="/blog/:id" element={<BlogPost />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<TermsOfUse />} />
                        </Routes>
                    </main>
                    <Footer />
                    <CookieConsent />
                </div>
            </Router>
        </CardsProvider>
    )
}

export default App
