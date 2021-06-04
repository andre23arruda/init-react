import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'

import { title } from '../../utils'

import logoImg from '../../assets/logo.svg'
import './Home.css'

function Home() {

    useEffect(() => title(document, 'Home'), [])

  	return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={ logoImg } alt="Title"/>
                </header>

                <main>
                    <h1>
                        Title
                    </h1>

                    <p>Text</p>

                    <Link to='/next-page'>
                        <span>
                            <FiLogIn />
                        </span>

                        <strong>
                            Example
                        </strong>

                    </Link>

                </main>

            </div>

        </div>
  	)
}

export default Home
