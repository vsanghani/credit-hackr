import { useState } from 'react'
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
import './App.css'

function App() {
    return (
        <Router>
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
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
