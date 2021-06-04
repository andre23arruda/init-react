import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'

import { title } from '../../utils'

import logoImg from '../../assets/logo.svg'
import './Footer.css'

function Footer() {

    useEffect(() => title(document, 'Footer'), [])

  	return (
        <div id="footer">
            <div className="content">
                <footer>
                    <img src={ logoImg } alt="Title"/>
                </footer>
            </div>

        </div>
  	)
}

export default Footer
