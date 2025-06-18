import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">Walrus ConvoX</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-medium">Login to your Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your registered Email Address</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input type="email" placeholder="user@company.com" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full">Login</Button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
