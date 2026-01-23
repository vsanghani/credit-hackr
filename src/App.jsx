import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CardDetail from './pages/CardDetail'
import HackrCalculator from './pages/HackrCalculator'
import Footer from './components/Footer'
import './App.css'

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cards/:id" element={<CardDetail />} />
                        <Route path="/hackr" element={<HackrCalculator />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    )
}

export default App
