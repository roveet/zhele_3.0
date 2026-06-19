import React from 'react'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-logo">желе 3.0</div>
      
      <nav className="main-nav">
        <a href="#concept" className="nav-link">Concept</a>
        <a href="#technology" className="nav-link">Technology</a>
        <a href="#materials" className="nav-link">Materials</a>
        <a href="#about" className="nav-link">About</a>
      </nav>
      
      <button className="btn-contact">
        Get in touch <span style={{ marginLeft: '8px' }}>+</span>
      </button>
    </header>
  )
}