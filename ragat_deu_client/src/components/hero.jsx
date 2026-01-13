"use client"

import { useEffect, useState } from "react"
import Button from "./buttons"
import landing from "../assets/images/landing.png"

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-50 transform translate-x-1/2 transition-all duration-1000"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1
                  className={`text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl transition-all duration-1000 ${isVisible ? "animate-slideInLeft opacity-100" : "opacity-0 translate-x-[-100px]"}`}
                >
                  <span className="block " >
                    Seeking Financial Aid for
                  </span>
                  <span className="block " >
                    Medical Emergencies or
                  </span>
                  <span className="block  text-green-600" >
                    Social Causes?
                  </span>
                </h1>
                <div
                  className={`mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start transition-all duration-1000 ${isVisible ? " opacity-100" : "opacity-0 translate-y-[50px]"}`}
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="rounded-md shadow">
                    <Button variant="secondary" size="large">
                      REQUEST DONATION
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button variant="outline" size="large">
                      DONATE AND HELP
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div
        className={`lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 transition-all duration-1000 ${isVisible ? "animate-slideInRight opacity-100" : "opacity-0 translate-x-[100px]"}`}
      >
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full hover:scale-105 transition-transform duration-700"
          src={landing}
          alt="Children smiling"
        />
      </div>
    </section>
  )
}

export default HeroSection
