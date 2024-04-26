import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Analysis from './pages/Analysis'

import Aos from 'aos'
import 'aos/dist/aos.css'
import { ThemeProvider } from 'contexts/ThemeContext'

function App() {
  const [theme, setTheme] = useState<string>('dark')

  useEffect(() => {
    Aos.init()
    if (localStorage.getItem('basit-portfolio-theme') === 'light') {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }
  }, [])

  const toggleThemeMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('basit-portfolio-theme', 'light')
      setTheme('light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('basit-portfolio-theme', 'dark')
      setTheme('dark')
    }
  }
  return (
    <ThemeProvider value={{ theme, setTheme, toggleThemeMode }}>
      <Router>
        <div className="h-screen px-7 pt-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200 font-rubik">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route
              path="*"
              element={
                <div className="flex h-screen items-center justify-center bg-gray-200">
                  <p className="text-center font-rubik text-2xl font-bold">
                    404 PAGE NOT FOUND
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
