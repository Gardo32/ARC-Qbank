'use client'

import { useState, useEffect } from 'react'
import { questions, Question, getTotalQuestions } from '../utils/examData'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Check, X, Sun, Moon } from 'lucide-react'

export default function PracticeExam() {
  const [name, setName] = useState<string>('')
  const [examStarted, setExamStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const totalQuestions = getTotalQuestions()
  const currentQuestion: Question = questions[currentQuestionIndex]

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleStartExam = () => {
    if (name.trim()) {
      setExamStarted(true)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + 1)
    } else {
      setIncorrectCount(incorrectCount + 1)
    }
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setShowAnswer(false)
    setCurrentQuestionIndex((prevIndex) => 
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    )
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome to the ARC Practice Exam</CardTitle>
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
            <Button onClick={handleStartExam} disabled={!name.trim()} className="text-lg">
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">ARC Practice Exam</CardTitle>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4 text-lg">
            <span>Welcome, {name}!</span>
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
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
          <RadioGroup value={selectedAnswer || ''} onValueChange={setSelectedAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} disabled={showAnswer} />
                <Label htmlFor={`option-${index}`} className="text-lg">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {showAnswer && (
            <div className="mt-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
              <p className={`text-lg font-semibold ${selectedAnswer === currentQuestion.answer ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {selectedAnswer === currentQuestion.answer ? (
                  <span className="flex items-center"><Check className="h-5 w-5 mr-2" /> Correct!</span>
                ) : (
                  <span className="flex items-center"><X className="h-5 w-5 mr-2" /> Incorrect.</span>
                )}
              </p>
              <p className="text-lg mt-2">Correct answer: {currentQuestion.answer}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer || showAnswer} className="text-lg">
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

