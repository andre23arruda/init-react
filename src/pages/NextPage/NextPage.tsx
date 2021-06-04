import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiCamera, FiCheckCircle } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'

import { Map , TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import logoImg from '../../assets/logo.svg'
import { getApi, postFormDataApi } from '../../services/api'
import { title } from '../../utils'


import './NextPage.css'

interface Example {
	id: number
	name: string,
    email: string
}


function NexPage() {

    const history = useHistory()

    useEffect(() => title(document, 'Cadastro'), [])

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [example, setExample] = useState<Example[]>([])
    const [image, setImage] = useState<any>(null)

    async function handleName(name: string){
        setName(name)
    }
    async function handleEmail(email: string){
        setEmail(email)
    }

    function handleSetImage(event: ChangeEvent<HTMLInputElement> ) {
		if (!event.target.files) return
		setImage(event.target.files[0])
	}

    const preview = useMemo( () => {
        return image ? URL.createObjectURL(image) : null
    }, [image])


    async function handleSubmit(event: any){
        event.preventDefault()
        const data = {
            name,
            email,
        }

        const response = await postFormDataApi('route/', data, '')
        if (response.id) {
           console.log('deu bom')
        }
    }

  	return (

        <div id="next-page">

            <div className="content">

                <form onSubmit={ event => handleSubmit(event) }>
                    <h1>
                        Cadastro
                    </h1>

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Adicione uma imagem do local</label>
                            <label id="image" className={ preview ? 'has-preview' : '' } style={{ backgroundImage: `url(${ preview })`}}>
                                <input type="file" onChange={ e => handleSetImage(e) }/>
                                { preview ? '' : <FiCamera color={ "#999" } fontSize={ 35 }/> }
                            </label>
                        </div>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input type="text" name="name" id="name" onChange={ event => handleName(event.target.value) }/>
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" onChange={ event => handleEmail(event.target.value) }/>
                            </div>

                        </div>
                    </fieldset>

                    <button>Cadastrar</button>

                </form>

            </div>

        </div>
  	)
}

export default NexPage
