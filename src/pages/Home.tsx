import ThemeContext from 'contexts/ThemeContext'
import React, { useState, useEffect, useContext } from 'react'
import { BsCamera } from 'react-icons/bs'
import { IoSendSharp } from 'react-icons/io5'
import { IoIosOptions } from 'react-icons/io'

const HomePage = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* A. Topmost section */}
      <div className="mb-12 flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex-1 text-center">
          <h1 className="font-pacifico text-4xl font-medium tracking-wider">
            healthALT
          </h1>
        </div>
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSideMenuIsVisible(true)}
            className="rounded-full p-2 transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
          >
            <IoIosOptions size={24} />
          </button>
          {/* <HiOutlineMenu size={24} /> */}
        </div>
      </div>

      {/* B. Next section */}
      <div className="mx-auto w-1/2 space-y-6 px-4">
        {/* Greeting */}
        <h2 className="text-center text-4xl font-medium">
          Good Morning, My Fannn
        </h2>

        {/* Input section */}
        <div className="relative">
          <input
            type="text"
            placeholder="What can I help you with"
            className="w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          />
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
            <button className="rounded-lg bg-red-600 px-3 py-2 dark:bg-gray-900">
              <BsCamera size={18} />
            </button>
            <button className="flex items-center rounded-lg bg-red-600 px-3 py-2 dark:bg-red-700">
              Start Chat <IoSendSharp size={18} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
