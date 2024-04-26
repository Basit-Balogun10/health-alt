import React, { useState, useEffect } from 'react'
import { BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import { IoSendSharp, IoCloseSharp, IoChevronDown } from 'react-icons/io5'
import { capitalizeString } from 'utils'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY
})

const HomePage = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(true)
  const [rememberData, setRememberData] = useState(false)
  const systemMessage = `INTRO:
The primary input from users is their health info (details later) and the meal/junk input. We need to do the following:

1) Recommend healthier alternatives to the input meal/junk food based on the nutritional content etc.
2) Each alternative should include the recipe, ingredients and comparison to the input meal/junk

HEALTH INFO:
The health info can include:
- Allergies or intolerances
- Diet goals: Weight loss or gain, Muscle building
- Dietary Preference: Halal, Vegetarian / Vegan
- Health conditions: Diabetes, High blood pressure, Heart disease, Amaenia
- Fitness Levels or activity: Sedentary or active athletes etc.
- Life stage: Pregnancy, Breastfeeding, childhood, Elderly, menstrual period etc.


RESPONSE FORMAT:

- Do not respond with any extra text outside of the JSON response. Your output should only be JSON

- First field in response should be the analysis of the meal/junk before proceeding with the alternatives. Just briefly discuss the nutritional content and the comparison of the meal/junk to the user health record (if provided any)

- Each alternative should have a name, ingredients, recipe and comparison field

- Separate each alternative from the other - including their recipes, ingredients and comparison.

- List ingredients and recipe as an array

- Let's indicate why we are recommending such an alternative based on users' health info. We let them know which one of their health info are taken into consideration AND HOW IT COMPARES WITH THE JUNK OR MEAL INPUT

GUIDELINES:
1) Do not respond to anything outside of food-health, return a js object of the type: { error: string }
2) If there are no health info provided, just analyze the junk/meal generally for the pros/cons etc. based on it's content and nutritional benefits
3) If there are no junk/meal provided, provide the user with a daily meal plan (for all 7 days of the week) based on their health info
4) The users are Nigerians, so only recommend Nigerian healthier meals/dishes/snacks 
5) Do not shorten words like tablespoons, etc.
5) Be empathetic to users like a doctor! Make use of pronouns like "your", "you"
6) Lastly, In comparison, do well to break down medical terms to LAYMAN understanding. If there are implications or anything, use easily-relatable explanations for the readers

INPUT FORMAT:
The meal/junk to analyze or suggest alternatives to is the meal property. 
{
  "allergies": string,
  "dietGoal": string,
  "dietaryPreference": string,
  "healthConditions": string,
  "fitnessLevel": string,
  "lifeStage": string,
  "meal": string,
}

Allergies, dietaryPreference, healthConditions and lifeStage being comma separated strings`
  const [messages, setMessages] = useState([
    { role: 'system', content: systemMessage }
  ])
  const [fitnessLevelDropdownOpen, setFitnessLevelDropdownOpen] =
    useState(false)
  const [formData, setFormData] = useState({
    allergies: '',
    dietGoal: '',
    dietaryPreference: '',
    healthConditions: '',
    fitnessLevel: '',
    lifeStage: '',
    meal: ''
  })

  useEffect(() => {
    const storedRememberData = localStorage.getItem('rememberData')
    if (storedRememberData) {
      setRememberData(JSON.parse(storedRememberData))
    }

    const storedFormData = localStorage.getItem('formData')
    if (storedFormData) {
      console.log('Data: ', JSON.parse(storedFormData))
      setFormData(JSON.parse(storedFormData))
    }
  }, [])

  const handleRememberDataChange = (e) => {
    e.preventDefault()
    setRememberData(!rememberData)
    localStorage.setItem('rememberData', JSON.stringify(!rememberData))

    // Using the fact that setState actions are asynchronous (so remeberData won't be updated yet, hence using !rememberData)
    if (!rememberData) {
      localStorage.setItem('formData', JSON.stringify(formData))
    } else {
      localStorage.removeItem('formData')
    }
  }

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

  const validateForm = () => {
    const {
      meal,
      allergies,
      dietGoal,
      dietaryPreference,
      healthConditions,
      fitnessLevel,
      lifeStage
    } = formData

    if (!meal.trim()) {
      return false
    }

    if (
      !allergies.trim() &&
      !dietGoal.trim() &&
      !dietaryPreference.trim() &&
      !healthConditions.trim() &&
      !fitnessLevel.trim() &&
      !lifeStage.trim()
    ) {
      return false
    }

    return true
  }

  const startConversationWithAI = async () => {
    // Ensure that the meal input is not empty and at least one health info is provided
    const formIsValid = validateForm()

    if (formIsValid) {
      
      console.log('Remember Data: ', rememberData)

      // Start the conversation with the AI
      const newMessage = { role: 'user', content: JSON.stringify(formData) }
      const msg = await anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 300,
        messages: [...messages, newMessage]
      })

      console.log('Response: ', msg)

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: msg
        }
      ])
    } else {
      alert(
        "Please provide your health information to help you better. We don't know you, your data is safe and doesn't leave your device"
      )
    }
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`${
          sideMenuIsVisible ? 'w-2/3' : 'w-full'
        } flex-col items-center justify-center`}
      >
        {/* A. Topmost section */}
        <div className="mb-12 flex items-center justify-between px-4 ">
          {/* Logo */}
          <div className="flex-1 text-center">
            <h1 className="font-[cursive] text-4xl font-medium tracking-wider">
              <span>health</span>
              <span className="text-teal-500">ALT</span>
            </h1>
          </div>
          {!sideMenuIsVisible && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSideMenuIsVisible(true)}
                className="rounded-full p-2 transition-colors ease-in-out hover:bg-gray-800 dark:bg-teal-700 dark:hover:bg-teal-600"
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
              value={formData.meal}
              onChange={handleFormChange}
              name="meal"
              type="text"
              placeholder="What can I help you with"
              className="w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2  focus:ring-teal-700 dark:border-teal-700 dark:bg-gray-800 dark:hover:border-teal-700"
            />
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <button className="rounded-lg border px-3 py-2 dark:border-teal-900/80 dark:bg-gray-900">
                <BsCamera size={18} />
              </button>
              <button
                onClick={startConversationWithAI}
                className="flex items-center rounded-lg bg-teal-700 px-3 py-2 dark:bg-teal-700"
              >
                Eat Healthier <IoSendSharp size={18} className="ml-2" />
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
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => setSideMenuIsVisible(false)}
            className="rounded-full p-2 transition-colors dark:hover:bg-gray-800"
          >
            <IoCloseSharp size={24} className="text-teal-500" />
          </button>
        </div>
        <div className="px-4">
          {/* <h2 className="mb-4 text-center text-2xl font-medium">
            Health Information
          </h2> */}
          <div className="mb-4">
            <label htmlFor="allergies" className="mb-2 block">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              placeholder="Ex. Peanuts, Groundnut oil (comma-separated)"
              className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700"
              onChange={handleFormChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="healthConditions" className="mb-2 block">
              Health Conditions
            </label>
            <input
              type="text"
              name="healthConditions"
              value={formData.healthConditions}
              placeholder="Ex. Diabetes, Heart Disease (comma-separated)"
              className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700"
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
              placeholder="Ex. Halal, Vegetarian, Vegan (comma-separated)"
              className="w-full rounded-lg border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700"
              onChange={handleFormChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fitnessLevel" className="mb-2 block">
              Fitness Level
            </label>
            <div className="relative">
              <button
                className={`w-full rounded-md border px-4 py-2 text-left transition-colors ease-in-out focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700 ${
                  !formData.fitnessLevel ? ' text-gray-300/40' : ''
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
              className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700"
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lifeStage" className="mb-2 block">
              Life Stage
            </label>
            <input
              type="text"
              name="lifeStage"
              value={formData.lifeStage}
              placeholder="Ex. Pregnancy, Elderly, Menstrual Period, Nursing"
              className="w-full rounded-lg  border px-4 py-2 outline-none transition-colors ease-in-out placeholder:text-gray-300/40 focus:ring-2 focus:ring-teal-700 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-teal-700"
              onChange={handleFormChange}
            />
          </div>

          <div className="m space-y-1">
            <p className="text-center text-xs text-gray-300/80">
              Your data is safe and only stored on your device
            </p>
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                id="rememberData"
                name="rememberData"
                checked={rememberData}
                onChange={handleRememberDataChange}
                className="sr-only mr-2" // Hide the default checkbox
              />
              <label
                htmlFor="rememberData"
                className={`relative mr-2 size-4 cursor-pointer rounded-[0.18rem] border border-teal-700 ${
                  rememberData ? 'bg-teal-700' : 'bg-transparent'
                }`}
              >
                {rememberData && (
                  <svg
                    className="absolute left-1/2 top-1/2 w-4 -translate-x-1/2 -translate-y-1/2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.2l-4.6-4.6 1.4-1.4 3.2 3.2 7.2-7.2 1.4 1.4-8.6 8.6z"
                    />
                  </svg>
                )}
              </label>
              <button
                onClick={handleRememberDataChange}
                className="text-teal-500"
              >
                Remember my data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePage
