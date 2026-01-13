"use client"

import React from 'react';
import { Heart, Users, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import Card from "./dashboardCard"

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("services-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      icon: Heart,
      title: "Request for Donation",
      description: "Get financial support for your medical emergencies and social causes",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Users,
      title: "Help someone who needs your donation",
      description: "Contribute to meaningful causes and make a difference in someone's life",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Shield,
      title: "All donors with will receive this benefits",
      description: "Enjoy exclusive benefits and recognition for your generous contributions",
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <section id="services-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center transition-all duration-1000 ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get our Free Services</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group ${isVisible ? "animate-fadeInUp opacity-100" : "opacity-0 translate-y-[50px]"}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 ${service.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}
              >
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
