import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiCamera, FiCheckCircle } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'

import { Map , TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'

import logoImg from '../../assets/logo.svg'
import { getApi, postFormDataApi } from '../../services/api'
import { title } from '../../utils'
import { CSSTransition } from 'react-transition-group'


import './CreatePoint.css'

interface CollectItem {
	id: number
	image: string
	name: string
}

interface Uf {
	id: number
	sigla: string
}

interface City {
	id: number
	nome: string
}


function CreatePoint() {

    const history = useHistory()

    useEffect(() => title(document, 'Criar ponto de coleta'), [])

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [whatsapp, setWhatsapp] = useState<string>('')
    const [collectItems, setCollectItems] = useState<CollectItem[]>([])
    const [ufList, setUfList] = useState<Uf[]>([])
    const [currentUf, setCurrentUf] = useState<string>('0')
    const [cityList, setCityList] = useState<City[]>([])
    const [currentCity, setCurrentCity] = useState<string>('')
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [selectedItems, setselectedItems] = useState<number[]>([])
    const [image, setImage] = useState<any>(null)

    const [popupTrigger, setPopupTrigger] = useState<boolean>(false)

    function getLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            setPosition([position.coords.latitude, position.coords.longitude])
        })
    }

    async function loadItems() {
        const response = await getApi(`items/`)
		setCollectItems(response)
	}
    useEffect(() => {
        getLocation()
        loadItems()
    }, [])

    async function loadUfList() {
        const urlUfApi = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
        const response = await getApi(urlUfApi, '', false)
		setUfList(response)
	}
    useEffect(() => {
        loadUfList()
    }, [])

    async function handleUfChange(uf: string){
        setCurrentUf(uf)
        const urlCityApi = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ uf }/municipios`
        const response = await getApi(urlCityApi, '', false)
        setCityList(response)
    }

    async function handleCityChange(city: string){
        setCurrentCity(city)
    }
    async function handleName(name: string){
        setName(name)
    }
    async function handleEmail(email: string){
        setEmail(email)
    }
    async function handleWhatsapp(whatsapp: string){
        setWhatsapp(whatsapp)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        const latitude = event.latlng.lat
        const longitude = event.latlng.lng
        setPosition([latitude, longitude])
    }

    function handleSelectItem(colletctItem_id: number) {
        if (selectedItems.includes(colletctItem_id)) {
            setselectedItems(selectedItems.filter(item => item !== colletctItem_id))
        } else {
            setselectedItems(selectedItems.concat([colletctItem_id]))
        }
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
            image,
            name,
            email,
            whatsapp,
            latitude: position[0],
            longitude: position[1],
            city: currentCity,
            uf: currentUf,
            items: selectedItems
        }

        const response = await postFormDataApi('places/', data, '')
        if (response.id) {
            setPopupTrigger(true)
            setTimeout(() => {
                history.push('/')
            }, 2000)
        }
    }

  	return (

        <div id="page-create-point">

            <div className="content">
                <header>
                    <img src={ logoImg } alt="Ecoleta"/>

                    <Link to='/'>
                        <FiArrowLeft /> Voltar
                    </Link>
                </header>

                <form onSubmit={ event => handleSubmit(event) }>
                    <h1>
                        Cadastro do <br /> ponto de coleta
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

                            <div className="field">
                                <label htmlFor="name">Whatsapp</label>
                                <input type="text" name="whatsapp" id="whatsapp" onChange={ event => handleWhatsapp(event.target.value) }/>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                            <span>Selecione o endereço no mapa</span>
                        </legend>

                        <Map center={ position }
                            style={ {width: '100%', height: 400} }
                            zoom={ 16 }
                            onclick={ handleMapClick }
                        >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={ position } />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select value={ currentUf } name="uf" id="uf" onChange={ event => handleUfChange(event.target.value) }>
                                    <option value='0'>Selecione um estado</option>
                                    { ufList.map(uf => (
                                        <option key={ uf.id } value={ uf.sigla }>{ uf.sigla }</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select value={ currentCity } name="city" id="city" onChange={ event => handleCityChange(event.target.value) }>
                                    { currentUf !== '' &&  cityList.map(city => (
                                        <option key={ city.id } value={ city.nome }>{ city.nome }</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Itens</h2>
                            <span>Selecione um ou mais itens abaixo</span>
                        </legend>

                        <ul className="items-grid">
                            { collectItems.map(colletctItem => (
                                <li
                                    key={ colletctItem.id }
                                    onClick={ () => handleSelectItem(colletctItem.id) }
                                    className={ selectedItems.includes(colletctItem.id) ? 'selected' : '' }
                                >
                                    <img src={ colletctItem.image } alt="" />
                                    <span>{ colletctItem.name }</span>
                                </li>
                            )) }
                        </ul>

                    </fieldset>

                    <button>Cadastrar ponto de coleta</button>

                </form>

            </div>

            {/* Mensagem de cadastro */}
            <CSSTransition
                in={ popupTrigger }
                timeout={ 400 }
                classNames="alert"
                unmountOnExit
                onEnter={() => {}}
                onExited={() => {}}
            >
                <div className="popup">
                    <div className="popup-inner">
                        <FiCheckCircle fontSize={ 38 } color="#34CB79"/>

                        <h1>Cadastro realizado com sucesso</h1>
                    </div>
                </div>
            </CSSTransition>

        </div>
  	)
}

export default CreatePoint
