'use client'

import { useState, useEffect } from 'react'
import { shuffleArray } from '../utils/shuffleArray'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check, X, Sun, Moon } from 'lucide-react'
import questionsData from '../data/questions.json'
import arcQuestionsData from '../data/ARC.json'
import NameInput from './NameInput'

interface Option {
  id: number
  text: string
}

interface Question {
  question: string
  options: Option[]
  correct_answer_ids: number[]
}

export default function Quiz() {
  const [name, setName] = useState<string>('')
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    const shuffledQuestions = shuffleArray(questionsData as Question[])
    setQuestions(shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    })))
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName)
    setExamStarted(true)
  }

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswers.every(answer =>
      currentQuestion.correct_answer_ids.includes(answer)
    ) && selectedAnswers.length === currentQuestion.correct_answer_ids.length

    if (isCorrect) {
      setScore(score + 1)
    } else {
      setIncorrectCount(incorrectCount + 1)
    }
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    setSelectedAnswers([])
    setShowAnswer(false)
    setCurrentQuestionIndex(prevIndex =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    )
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(event.target.value) - 1
    if (newIndex >= 0 && newIndex < questions.length) {
      setCurrentQuestionIndex(newIndex)
      setSelectedAnswers([])
      setShowAnswer(false)
    }
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to the CC301 Practice Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="name" className="text-lg">Please enter your name:</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="mt-2 text-lg"
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={() => handleNameSubmit(name)} disabled={!name.trim()} className="text-lg">
              Start Exam
            </Button>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
              <Moon className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex] || { question: '', options: [], correct_answer_ids: [] }
  const isMultipleChoice = currentQuestion.correct_answer_ids?.length > 1

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">AWS Practice Exam</CardTitle>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4 text-lg">
            <span>Welcome, {name}!</span>
            <span className="flex items-center">
              Question
              <Input 
                type="number"
                value={currentQuestionIndex + 1}
                onChange={handleQuestionChange}
                className="w-16 mx-2 text-center"
                min={1}
                max={questions.length}
              />
              of {questions.length}
            </span>
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <span className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-1" /> Correct: {score}
            </span>
            <span className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-1" /> Incorrect: {incorrectCount}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          {isMultipleChoice ? (
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`option-${option.id}`}
                    checked={selectedAnswers.includes(option.id)}
                    onChange={() => {
                      setSelectedAnswers(prevSelected =>
                        prevSelected.includes(option.id)
                          ? prevSelected.filter(id => id !== option.id)
                          : [...prevSelected, option.id]
                      )
                    }}
                    disabled={showAnswer}
                    className="h-5 w-5"
                  />
                  <Label htmlFor={`option-${option.id}`} className="text-lg">{option.text}</Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup value={selectedAnswers[0]?.toString() || ''} onValueChange={(value) => {
              setSelectedAnswers([parseInt(value)])
            }}>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`option-${option.id}`}
                      disabled={showAnswer}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={`option-${option.id}`} className="text-lg">{option.text}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
          {showAnswer && (
            <div className="mt-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
              <p className={`text-lg font-semibold ${selectedAnswers.every(answer => currentQuestion.correct_answer_ids.includes(answer)) && selectedAnswers.length === currentQuestion.correct_answer_ids.length ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {selectedAnswers.every(answer => currentQuestion.correct_answer_ids.includes(answer)) && selectedAnswers.length === currentQuestion.correct_answer_ids.length ? (
                  <span className="flex items-center"><Check className="h-5 w-5 mr-2" /> Correct!</span>
                ) : (
                  <span className="flex items-center"><X className="h-5 w-5 mr-2" /> Incorrect.</span>
                )}
              </p>
              <p className="text-lg mt-2">Correct answers: {currentQuestion.options.filter(option => currentQuestion.correct_answer_ids.includes(option.id)).map(option => option.text).join(', ')}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleAnswerSubmit} disabled={selectedAnswers.length === 0 || showAnswer} className="text-lg">
            Submit Answer
          </Button>
          <Button onClick={handleNextQuestion} disabled={!showAnswer || currentQuestionIndex === questions.length - 1} className="text-lg">
            Next Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
