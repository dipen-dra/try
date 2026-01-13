"use client"

import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegister } from '../../hooks/useRegisterUserTan';
import { User, Mail, Phone, Lock, Heart, FileText, Droplet } from 'lucide-react';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import AuthLayout from "../AuthLayout"

const RegisterForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPending, setIsPending] = useState(false)

  // Steps configuration
  const steps = [
    {
      id: "name",
      title: "What's your name?",
      subtitle: "Let's start with your full name",
      icon: User,
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      id: "email",
      title: "Your email address?",
      subtitle: "We'll use this to contact you",
      icon: Mail,
      placeholder: "Enter your email address",
      type: "email",
    },
    {
      id: "contact",
      title: "Contact number?",
      subtitle: "Your phone number for important updates",
      icon: Phone,
      placeholder: "Enter your contact number",
      type: "tel",
    },
    {
      id: "disease",
      title: "Your condition?",
      subtitle: "What disease or condition do you have?",
      icon: Heart,
      placeholder: "e.g., Cancer, Kidney Disease",
      type: "text",
    },
    {
      id: "description",
      title: "Tell us more (Optional)",
      subtitle: "Briefly describe your situation",
      icon: FileText,
      placeholder: "Describe your situation or needs",
      type: "textarea",
    },
    {
      id: "password",
      title: "Create a password",
      subtitle: "Choose a strong password for your account",
      icon: Lock,
      placeholder: "Create a secure password",
      type: "password",
    },
  ]

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
      disease: "",
      description: "",
      password: "",
      agreeTerms: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Full name must be at least 3 characters").required("Full name is required"),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      contact: Yup.string()
        .matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits')
        .required('Contact number is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Must contain at least one number')
        .matches(/[^A-Za-z0-9]/, 'Must contain at least one special character')
        .required('Password is required'),
      disease: Yup.string().when('role', {
        is: 'user',
        then: Yup.string().required('Disease or condition is required'),
        otherwise: Yup.string(),
      }),
      description: Yup.string(),
      agreeTerms: Yup.boolean().oneOf([true], "You must agree to the Terms of Use and Privacy Policy"),
    }),
    onSubmit: async (values) => {
      setIsPending(true)
      try {
        const { agreeTerms, ...payload } = values

        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:5050/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          navigate("/login")
        } else {
          if (data.message?.includes("already exists")) {
            formik.setErrors({ general: "A user with this email or contact number already exists." })
          } else {
            formik.setErrors({ general: data.message || "Registration failed" })
          }
        }
      } catch (error) {
        formik.setErrors({ general: error.message || "Registration failed" })
      } finally {
        setIsPending(false)
      }
    },
  })

  const handleNext = () => {
    const currentField = steps[currentStep].id

    // Validate current field
    formik.setFieldTouched(currentField, true)

    if (currentField === "description") {
      // Description is optional, so we can proceed
      setCurrentStep(currentStep + 1)
    } else if (!formik.errors[currentField] && formik.values[currentField]) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && currentStep < steps.length) {
      e.preventDefault()
      handleNext()
    }
  }

  const isCurrentStepValid = () => {
    const currentField = steps[currentStep].id
    if (currentField === "description") return true // Optional field
    return !formik.errors[currentField] && formik.values[currentField]
  }

  // Summary step (after all input steps)
  if (currentStep === steps.length) {
    return (
      <AuthLayout>
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-500 via-blood-600 to-blood-700 rounded-2xl shadow-xl mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              <CheckCircle className="w-8 h-8 text-white fill-current relative z-10" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
              Review Your Information
            </h1>
            <p className="text-gray-500 text-sm font-light">Please confirm your details before creating your account</p>
          </div>

          {/* General Error Message */}
          {formik.errors.general && (
            <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                <span className="text-red-700 text-sm font-medium">{formik.errors.general}</span>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const value = formik.values[step.id]

              if (!value && step.id === "description") return null // Skip empty optional field

              return (
                <div
                  key={step.id}
                  className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blood-100 to-emerald-100 rounded-lg mr-3">
                    <Icon className="w-4 h-4 text-blood-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600">{step.title.replace("?", "")}</p>
                    <p className="text-gray-900 font-medium text-sm">{step.id === "password" ? "••••••••" : value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className="text-blood-600 hover:text-blood-700 text-xs font-medium"
                  >
                    Edit
                  </button>
                </div>
              )
            })}
          </div>

          {/* Terms Agreement */}
          <div className="mb-6">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative mt-0.5">
                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-blood-400" size={20} />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blood-500 transition-all ${formik.touched.password && formik.errors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 hover:border-blood-300'
                        }`}
                      {...formik.getFieldProps('password')}
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-xs mt-1 ml-2">{formik.errors.password}</div>
                  )}

                  {/* Password Strength Meter */}
                  {formik.values.password && (
                    <PasswordStrengthMeter password={formik.values.password} />
                  )}
                </div>
              </div>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formik.values.agreeTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-checkbox h-4 w-4 text-blood-600 transition duration-150 ease-in-out rounded-md border-gray-300 focus:ring-blood-500"
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                By creating an account, you agree to the{" "}
                <Link to="/terms" className="text-blood-600 hover:text-blood-700 font-medium underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blood-600 hover:text-blood-700 font-medium underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {
              formik.touched.agreeTerms && formik.errors.agreeTerms && (
                <div className="flex items-center space-x-1 text-red-600 text-xs mt-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>{formik.errors.agreeTerms}</span>
                </div>
              )
            }
          </div >

          {/* Action Buttons */}
          < div className="flex space-x-3" >
            <button
              type="button"
              onClick={handlePrevious}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={formik.handleSubmit}
              disabled={isPending || !formik.values.agreeTerms}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blood-500 via-blood-600 to-blood-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blood-600 via-blood-700 to-blood-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{isPending ? "Creating account..." : "Create Account"}</span>
              {!isPending && (
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              )}
              {isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
              )}
            </button>
          </div >

          {/* Login Link */}
          < div className="text-center mt-4 pt-4 border-t border-gray-100" >
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blood-600 hover:text-blood-700 transition-colors duration-200 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div >
        </div >
      </AuthLayout >
    )
  }

  // Individual step rendering
  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-blood-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blood-500 to-blood-1000 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-500 via-blood-600 to-blood-700 rounded-2xl shadow-xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            <Icon className="w-8 h-8 text-white relative z-10" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-gray-500 text-base font-light">{currentStepData.subtitle}</p>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon
                className={`h-5 w-5 transition-colors duration-200 ${formik.touched[currentStepData.id] && formik.errors[currentStepData.id]
                  ? "text-red-400"
                  : "text-gray-400 group-focus-within:text-blood-500"
                  }`}
              />
            </div>

            {currentStepData.type === "textarea" ? (
              <textarea
                name={currentStepData.id}
                value={formik.values[currentStepData.id]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onKeyPress={handleKeyPress}
                placeholder={currentStepData.placeholder}
                rows="4"
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg ${formik.touched[currentStepData.id] && formik.errors[currentStepData.id]
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-blood-400 focus:ring-blood-100 hover:border-gray-300"
                  } focus:ring-4 focus:ring-opacity-20 focus:outline-none text-gray-900 placeholder-gray-400`}
              />
            ) : (
              <input
                type={currentStepData.type}
                name={currentStepData.id}
                value={formik.values[currentStepData.id]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onKeyPress={handleKeyPress}
                placeholder={currentStepData.placeholder}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-lg ${formik.touched[currentStepData.id] && formik.errors[currentStepData.id]
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:border-blood-400 focus:ring-blood-100 hover:border-gray-300"
                  } focus:ring-4 focus:ring-opacity-20 focus:outline-none text-gray-900 placeholder-gray-400`}
              />
            )}
          </div>

          {/* Error Message */}
          {formik.touched[currentStepData.id] && formik.errors[currentStepData.id] && (
            <div className="flex items-center space-x-2 text-red-600 text-sm mt-3 animate-in slide-in-from-top-1 duration-200">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <span>{formik.errors[currentStepData.id]}</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid() && currentStepData.id !== "description"}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blood-500 via-blood-600 to-blood-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blood-600 via-blood-700 to-blood-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">{currentStep === steps.length - 1 ? "Review" : "Next"}</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blood-600 hover:text-blood-700 transition-colors duration-200 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default RegisterForm


