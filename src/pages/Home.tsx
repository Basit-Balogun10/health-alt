import React, { useState, useEffect } from 'react'
import { BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import { IoSendSharp, IoCloseSharp, IoChevronDown } from 'react-icons/io5'
import { capitalizeString } from 'utils'

const HomePage = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(true)
  const [fitnessLevelDropdownOpen, setFitnessLevelDropdownOpen] =
    useState(false)
  const [formData, setFormData] = useState({
    allergies: [],
    dietGoal: '',
    dietaryPreference: '',
    healthConditions: [],
    fitnessLevel: '',
    lifeStage: ''
  })

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData')
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData))
    }
  }, [])

  const handleFitnessLevelChange = (level) => {
    setFormData({ ...formData, fitnessLevel: level })
    setFitnessLevelDropdownOpen(false) // Close the dropdown after selection
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [...prevData[name], value]
        }))
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: prevData[name].filter((item) => item !== value)
        }))
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('formData', JSON.stringify(formData))
    // You can perform any additional actions with the form data here
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className={`${
          sideMenuIsVisible ? 'w-2/3' : 'w-full'
        } flex-col items-center justify-center`}
      >
        {/* A. Topmost section */}
        <div className="mb-12 flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <div className="flex-1 text-center">
            <h1 className="font-[cursive] text-4xl font-medium tracking-wider">
              healthALT
            </h1>
          </div>
          {!sideMenuIsVisible && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSideMenuIsVisible(true)}
                className="rounded-full p-2 transition-colors hover:bg-gray-800 dark:hover:bg-gray-600"
              >
                <IoIosOptions size={24} />
              </button>
            </div>
          )}
        </div>

        {/* B. Next section */}
        <div
          className={`mx-auto ${
            sideMenuIsVisible ? 'w-3/4' : 'w-1/2'
          } space-y-6 px-4`}
        >
          {/* Greeting */}
          <h2 className="text-center text-4xl font-medium">
            Good Morning, My Fannn
          </h2>
          {/* Input section */}
          <div className="relative">
            <input
              type="text"
              placeholder="What can I help you with"
              className="w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none focus:outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-800"
            />
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <button className="rounded-lg bg-red-600 px-3 py-2 dark:bg-gray-900">
                <BsCamera size={18} />
              </button>
              <button className="flex items-center rounded-lg bg-teal-700 px-3 py-2 dark:bg-teal-700">
                Start Chat <IoSendSharp size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <div
        className={`fixed right-0 top-0 h-screen w-1/3 border-l-2 border-l-teal-800 px-6 shadow-lg transition-transform duration-300 dark:bg-gray-900 ${
          sideMenuIsVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setSideMenuIsVisible(false)}
            className="rounded-full p-2 transition-colors dark:hover:bg-gray-800"
          >
            <IoCloseSharp size={24} className="text-teal-500" />
          </button>
        </div>
        <div className="mt-[4.2rem px-4">
          {/* <h2 className="mb-4 text-center text-2xl font-medium">
            Health Information
          </h2> */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="allergies" className="mb-2 block">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                placeholder="Ex. Peanuts, Groundnut oil (comma-separated)"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900"
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="healthConditions" className="mb-2 block">
                Health Conditions
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.healthConditions}
                placeholder="Ex. Diabetes, Heart Disease, Anaemia (comma-separated)"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900"
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="dietaryPreference" className="mb-2 block">
                Dietary Preference
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.dietaryPreference}
                placeholder="Ex. Halal, Vegetarian, Vegan (comma-separated)"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900"
                onChange={handleFormChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fitnessLevel" className="mb-2 block">
                Fitness Level
              </label>
              <div className="relative">
                <button
                  className={`w-full rounded-md border px-4 py-2 text-left dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-2 focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900 ${
                    !formData.fitnessLevel ? 'text-gray-300/80' : ''
                  }`}
                  onClick={() => {
                    setFitnessLevelDropdownOpen(!fitnessLevelDropdownOpen)
                  }}
                >
                  {capitalizeString(formData.fitnessLevel) ||
                    'Select Fitness Level'}
                </button>
                <div className="absolute left-[90%] top-[0.55rem] w-full">
                  <IoChevronDown size={24} className="text-teal-500" />
                </div>
                {fitnessLevelDropdownOpen && (
                  <div className="absolute left-0 top-14 w-full rounded-md border border-gray-300 bg-white shadow-md ring-2 ring-teal-700 dark:border-teal-700 dark:bg-gray-800">
                    <button
                      className={`w-full rounded-md px-4 py-2 hover:rounded-none hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-teal-700`}
                      onClick={() => handleFitnessLevelChange('sedentary')}
                    >
                      Sedentary (Little or no exercise)
                    </button>
                    <button
                      className={`w-full rounded-md px-4 py-2 hover:rounded-none hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-teal-700`}
                      onClick={() => handleFitnessLevelChange('moderate')}
                    >
                      Moderate (Exercise 3-5 days/week)
                    </button>
                    <button
                      className={`w-full rounded-md px-4 py-2 hover:rounded-none hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-teal-700`}
                      onClick={() => handleFitnessLevelChange('active')}
                    >
                      Active (Exercise 6-7 days/week)
                    </button>
                    <button
                      className={`w-full rounded-md px-4 py-2 hover:rounded-none hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-teal-700`}
                      onClick={() => handleFitnessLevelChange('veryActive')}
                    >
                      Very Active (Exercise multiple times per day)
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="dietGoal" className="mb-2 block">
                Diet Goal
              </label>
              <input
                type="text"
                name="dietGoal"
                value={formData.dietGoal}
                placeholder="Enter your diet goal"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900"
                onChange={handleFormChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dietaryPreference" className="mb-2 block">
                Dietary Preference
              </label>
              <input
                type="text"
                name="dietaryPreference"
                value={formData.dietaryPreference}
                placeholder="Enter your dietary preference"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 dark:hover:border-teal-500 transition-colors ease-in-out focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-900"
                onChange={handleFormChange}
              />
            </div>

            {/* Add similar input fields for healthConditions and lifeStage */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="flex items-center rounded-md border border-teal-700 bg-teal-700 px-4 py-2 text-white "
              >
                Save Information <IoSendSharp size={18} className="ml-3" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default HomePage
