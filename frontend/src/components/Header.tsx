import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import logoWhite from '../images/logo-white.svg'
import heroBg from '../images/herobg.png'

function Header () {
  return <Fragment>
    <nav className="navbar is-dark is-boxed" role="navigation" aria-label="navigation">
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src={logoWhite} alt="TimelessMusic" height="28" style={{ height: '2em' }} />
          </Link>
        </div>
      </div>
    </nav>
    <section className="hero" style={{ background: '#171717', margin: '0 0 1em 0' }} >
      <div className="container" style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}>
        <div className="hero-body">
          <h1 className="title" style={{ color: '#FFF' }}>
            We have the power of time and the love for music
          </h1>
          <h2 className="subtitle" style={{ color: '#ccc' }}>
            Travel back in time to attend gigs that made history
          </h2>
        </div>
      </div>
    </section>
  </Fragment >
}

export default Header
