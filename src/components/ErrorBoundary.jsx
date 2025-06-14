// src/ErrorBoundary.js
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Caught error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-red-600 font-semibold">
          <h1>Something went wrong with the map.</h1>
          <p>Please try reloading or resetting the route.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
