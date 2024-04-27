import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { BsCamera } from 'react-icons/bs'
import { IoIosOptions } from 'react-icons/io'
import { IoSendSharp, IoCloseSharp, IoChevronDown } from 'react-icons/io5'
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa6'
import { capitalizeString } from 'utils'

const HomePage = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(true)
  const [rememberData, setRememberData] = useState(false)
  const [isFetchingResponse, setIsFetchingResponse] = useState(false)
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('alternatives')
  const [currentAlternativeIndex, setCurrentAlternativeIndex] = useState(0)
  const [latestAIResponse, setLatestAIResponse] = useState(null)
  // const [latestAIResponse, setLatestAIResponse] = useState({
  //   overview:
  //     'A milky doughnut is a high-calorie, sugary snack that provides little nutritional value. It is high in refined carbohydrates and saturated fats, which can contribute to weight gain and negatively impact blood sugar control for individuals with diabetes. Additionally, the high sugar content may worsen menstrual cramps and discomfort during menstruation.',
  //   alternatives: [
  //     {
  //       name: 'Oatmeal Pancakes with Banana and Honey',
  //       ingredients: [
  //         '1 cup oat flour',
  //         '1 ripe banana, mashed',
  //         '2 eggs',
  //         '1/2 cup milk (dairy or plant-based)',
  //         '1 tablespoon honey',
  //         '1 teaspoon baking powder',
  //         '1/2 teaspoon cinnamon',
  //         'Pinch of salt'
  //       ],
  //       recipe: [
  //         'In a bowl, mix together the oat flour, baking powder, cinnamon, and salt.',
  //         'In another bowl, whisk together the mashed banana, eggs, milk, and honey.',
  //         'Pour the wet ingredients into the dry ingredients and mix until well combined.',
  //         'Heat a non-stick pan over medium heat and scoop 1/4 cup of batter per pancake.',
  //         'Cook for 2-3 minutes on each side or until golden brown.',
  //         'Serve warm with additional sliced banana and a drizzle of honey, if desired.'
  //       ],
  //       comparison:
  //         'These oatmeal pancakes are a healthier alternative to a milky doughnut. Oats are a whole grain that provides fiber, which can help with weight management and blood sugar control. The use of a ripe banana adds natural sweetness and reduces the need for added sugars. This recipe is also suitable for your halal dietary preference. During menstruation, the combination of complex carbohydrates and protein can help stabilize energy levels and reduce cravings for sugary snacks.'
  //     },
  //     {
  //       name: 'Baked Sweet Potato Wedges with Avocado Dip',
  //       ingredients: [
  //         '2 medium sweet potatoes, cut into wedges',
  //         '1 tablespoon olive oil',
  //         '1/2 teaspoon paprika',
  //         'Salt and pepper to taste',
  //         '1 ripe avocado',
  //         '1/4 cup plain Greek yogurt',
  //         '1 tablespoon lemon juice',
  //         '1 small garlic clove, minced'
  //       ],
  //       recipe: [
  //         'Preheat the oven to 200°C (400°F).',
  //         'In a bowl, toss the sweet potato wedges with olive oil, paprika, salt, and pepper.',
  //         'Arrange the wedges on a baking sheet and bake for 25-30 minutes, flipping halfway through, until crispy and tender.',
  //         'In a separate bowl, mash the avocado and mix in the Greek yogurt, lemon juice, garlic, and a pinch of salt.',
  //         'Serve the baked sweet potato wedges with the avocado dip on the side.'
  //       ],
  //       comparison:
  //         "Baked sweet potato wedges are a nutrient-dense snack option compared to a milky doughnut. Sweet potatoes are rich in fiber, vitamins A and C, and have a lower glycemic index, which means they won't spike your blood sugar as quickly. The addition of a healthy fat source like avocado can help with satiety and nutrient absorption. Greek yogurt provides protein and probiotics, which may be beneficial for digestive health during menstruation. This snack is also halal-friendly and can support your weight loss goals and active lifestyle."
  //     }
  //   ]
  // })

  const handleBuyIngredients = () => {
    console.log(
      'Buy ingredients:',
      latestAIResponse.alternatives[currentAlternativeIndex]
    )

    
  }

  const handleBuyAlternative = () => {
    console.log(
      'Buy alternative:',
      latestAIResponse.alternatives[currentAlternativeIndex]
    )
  }

  const toggleSection = (section) => {
    console.log('toggling...', section)
    setLatestAIResponse((prevState) => ({
      ...prevState,
      alternatives: prevState.alternatives.map((alternative, index) => {
        if (index === currentAlternativeIndex) {
          console.log(index, currentAlternativeIndex)

          console.log('section: ', alternative, alternative[section].isOpen)
          return {
            ...alternative,
            [section]: {
              ...alternative[section],
              ...{ isOpen: !alternative[section].isOpen }
            }
          }
        }
        return alternative
      })
    }))
  }

  // useEffect(() => {
  //   setLatestAIResponse((prevState) => ({
  //     ...prevState,
  //     alternatives: prevState.alternatives.map((alternative) => ({
  //       ...alternative,
  //       comparison: { isOpen: false, content: alternative.comparison },
  //       ingredients: { isOpen: false, content: alternative.ingredients },
  //       recipe: { isOpen: false, content: alternative.recipe }
  //     }))
  //   }))
  // }, [])

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
      setIsFetchingResponse(true)
      console.log('Remember Data: ', rememberData)

      // Start the conversation with the AI
      // Start the conversation with the AI
      const newMessage = { role: 'user', content: JSON.stringify(formData) }

      try {
        const response = await axios.post('/api/v1/ai-conversation', {
          messageHistory: [...messages, newMessage]
        })

        console.log('Response: ', response.data)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: JSON.parse(response.data.msg.content[0].text)
          }
        ])
        setLatestAIResponse(JSON.parse(response.data.msg.content[0].text))
      } catch (error) {
        console.error(error)
        alert(
          'We encountered a problem while trying to recommend your healthier dishes. Please try again later'
        )
      } finally {
        setIsFetchingResponse(false)
      }
    } else {
      alert(
        "Please provide your health information to help you better. We don't know you, your data is safe and doesn't leave your device"
      )
    }
  }

  return (
    <div className="relative flex flex-col items-start justify-center h-full overflow-hidden">
      <div
        className={`my-auto ${
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
            <div className="absolute top-2 right-0 flex items-center space-x-4">
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
          className={`h-full mx-auto ${
            sideMenuIsVisible ? 'w-3/4' : 'w-1/2'
          } space-y-4 px-4`}
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
              className="w-full rounded-2xl border border-gray-300 py-4 pl-6 pr-24 outline-none transition-colors ease-in-out focus:outline-none focus:ring-2  focus:ring-teal-700 dark:border-teal-800 dark:bg-gray-800 dark:hover:border-teal-700"
            />
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 space-x-2">
              <button
                disabled={isFetchingResponse}
                className="rounded-lg border px-3 py-2 dark:border-teal-900/80 dark:bg-gray-900"
              >
                <BsCamera size={18} />
              </button>
              <button
                disabled={isFetchingResponse}
                onClick={startConversationWithAI}
                className={`flex items-center rounded-lg text-white bg-teal-700 px-3 py-2 transition-colors ease-in-out dark:bg-teal-500 dark:hover:bg-teal-600 ${
                  isFetchingResponse ? 'opacity-70' : ''
                }`}
              >
                <span className="mt-0.5">healthALT</span>
                {isFetchingResponse ? (
                  <ClipLoader
                    color={'#FFF'}
                    loading={isFetchingResponse}
                    size={18}
                    className="ml-2"
                  />
                ) : (
                  <IoSendSharp size={18} className="ml-2" />
                )}
              </button>
            </div>
          </div>

          {latestAIResponse && (
            <div className="h-full flex-1 flex flex-col">
              <div className="mb-4 flex items-center space-x-4 mx-auto border border w-min px-3 py-[0.35rem] rounded-md bg-gray-800 border-gray-800">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`rounded-md px-4 py-2 transition-colors ease-in-out ${
                    activeTab === 'overview'
                      ? 'bg-teal-500 text-white'
                      : ' text-gray-800 hover:bg-gray-300 dark:bg-gray-700/20 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('alternatives')}
                  className={`rounded-md px-4 py-2 transition-colors ease-in-out ${
                    activeTab === 'alternatives'
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-800 hover:bg-gray-300 dark:bg-gray- dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Alternatives
                </button>
              </div>

              <div className="response-container bg-gray-800 rounded-md border border-gray-800 max-h-[40vh] overflow-y-scroll">
                {activeTab === 'overview' ? (
                  <div className="p-4">{latestAIResponse.overview}</div>
                ) : (
                  <div className="p-4">
                    <h2 className="mb-4 text-center text-2xl">
                      {
                        latestAIResponse.alternatives[currentAlternativeIndex]
                          .name
                      }
                    </h2>

                    <div>
                      <div
                        className="group mb-4 flex cursor-pointer items-center justify-between rounded-md bg-gray-900 border border-gray-900 hover:border-gray-700 p-2 hover:bg-gray-700 transition ease-in-out"
                        onClick={() => toggleSection('comparison')}
                      >
                        <span>Comparison</span>
                        {latestAIResponse.alternatives[currentAlternativeIndex]
                          .comparison.isOpen ? (
                          <FaChevronDown
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        ) : (
                          <FaChevronRight
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        )}
                      </div>
                      {latestAIResponse.alternatives[currentAlternativeIndex]
                        .comparison.isOpen && (
                        <div className="mb-4 rounded-md bg-gray-700 p-4">
                          {
                            latestAIResponse.alternatives[
                              currentAlternativeIndex
                            ].comparison.content
                          }
                        </div>
                      )}

                      <div
                        className="group mb-4 flex cursor-pointer items-center justify-between rounded-md bg-gray-900 border border-gray-900 hover:border-gray-700 p-2 hover:bg-gray-700 transition ease-in-out"
                        onClick={() => toggleSection('ingredients')}
                      >
                        <span>Ingredients</span>
                        {latestAIResponse.alternatives[currentAlternativeIndex]
                          .ingredients.isOpen ? (
                          <FaChevronDown
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        ) : (
                          <FaChevronRight
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        )}
                      </div>

                      {latestAIResponse.alternatives[currentAlternativeIndex]
                        .ingredients.isOpen && (
                        <div className="mb-4 rounded-md bg-gray-700 p-4">
                          <ul>
                            {latestAIResponse.alternatives[
                              currentAlternativeIndex
                            ].ingredients.content.map((ingredient, index) => (
                              <li key={index} className="mb-2">
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div
                        className="group mb-4 flex cursor-pointer items-center justify-between rounded-md bg-gray-900 border border-gray-900 hover:border-gray-700 p-2 hover:bg-gray-700 transition ease-in-out"
                        onClick={() => toggleSection('recipe')}
                      >
                        <span>Recipe</span>
                        {latestAIResponse.alternatives[currentAlternativeIndex]
                          .recipe.isOpen ? (
                          <FaChevronDown
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        ) : (
                          <FaChevronRight
                            className="text-teal-700 group-hover:text-teal-500"
                            size={20}
                          />
                        )}
                      </div>

                      {latestAIResponse.alternatives[currentAlternativeIndex]
                        .recipe.isOpen && (
                        <div className="mb-4 rounded-md bg-gray-700 p-4">
                          <ol className="list-decimal pl-4">
                            {latestAIResponse.alternatives[
                              currentAlternativeIndex
                            ].recipe.content.map((step, index) => (
                              <li key={index} className="mb-2">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                {activeTab === 'alternatives' && (
                  <button
                    onClick={() =>
                      setCurrentAlternativeIndex((prevIndex) =>
                        Math.max(prevIndex - 1, 0)
                      )
                    }
                    className={`rounded-full p-2 transition-colors ease-in-out dark:hover:bg-gray-800 ${
                      currentAlternativeIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={currentAlternativeIndex === 0}
                  >
                    <FaArrowLeftLong size={24} className="text-teal-500" />
                  </button>
                )}

                <div className="w-full flex items-center justify-center">
                  <button
                    onClick={handleBuyIngredients}
                    className="rounded-md bg-transparent hover:bg-teal-600 px-4 py-2 text-white transition-colors ease-in-out border-2 border-teal-600 focus:ring-4 focus:ring-teal-800"
                  >
                    Buy Ingredients
                  </button>
                  <button
                    onClick={handleBuyAlternative}
                    className="ml-2 rounded-md bg-teal-500 border-2 border-teal-500 hover:border-teal-600 px-4 py-2 text-white transition-colors ease-in-out hover:bg-teal-600 focus:ring-4 focus:ring-teal-800"
                  >
                    Buy Meal
                  </button>
                </div>

                {activeTab === 'alternatives' && (
                  <button
                    onClick={() =>
                      setCurrentAlternativeIndex((prevIndex) =>
                        Math.min(
                          prevIndex + 1,
                          latestAIResponse.alternatives.length - 1
                        )
                      )
                    }
                    className={`rounded-full p-2 transition-colors ease-in-out dark:hover:bg-gray-800 ${
                      currentAlternativeIndex ===
                      latestAIResponse.alternatives.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={
                      currentAlternativeIndex ===
                      latestAIResponse.alternatives.length - 1
                    }
                  >
                    <FaArrowRightLong size={24} className="text-teal-500" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Menu */}
      <div
        className={`fixed right-0 top-0 h-screen w-1/3 border-l-2 border-l-gray-700 shadow-black/30 shadow-xl px-6 shadow-lg transition-transform duration-300 dark:bg-gray-900 ${
          sideMenuIsVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setSideMenuIsVisible(false)}
            className="rounded-full p-2 transition-colors ease-in-out dark:hover:bg-gray-800"
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
                className={`relative mr-2 size-4 cursor-pointer rounded-[0.18rem] border border-teal-500 ${
                  rememberData ? 'bg-teal-500' : 'bg-transparent'
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
                className="text-teal-400"
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
