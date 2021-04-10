import React, { useState } from 'react'
import Modal from './modal'
import { USER_DATA } from './strings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow, faTimes } from '@fortawesome/free-solid-svg-icons'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Select from 'react-validation/build/select';
import Button from 'react-validation/build/button';
import { required } from './validations/validations'
import Loader from './loader'
import axios from 'axios'

var marker = null;

export default function Estadios({
   map,
   reduced, 
   controlHeaderReduced, 
   wizardActive, 
   setWizardActive, 
   setButtonViewDisabled
}) {

   let userData = JSON.parse(localStorage.getItem(USER_DATA));
   let apellido = userData.name.split(" ").pop();

   let [location, setLocation] = useState(null);
   let [locationSelected, setLocationSelected] = useState(false);
   let [id, setId] = useState(userData.id);
   let [nombre, setNombre] = useState(`Estadio ${apellido}`);
   let [apodo, setApodo] = useState('El épico');
   let [saving, setSaving] = useState(false);

   const startWizard = ()=>{
      setupEventForMap();
      setWizardActive(true);
      controlHeaderReduced(true);
      setButtonViewDisabled(true);
      setNombre(`Estadio ${apellido}`);
      setApodo('El épico');
   }

   const cancelWizard = ()=>{
      releaseMapEvents();
      setWizardActive(false);
      controlHeaderReduced(false);
      setButtonViewDisabled(false);
      setLocation(null);
      setLocationSelected(false);
      setNombre('')
      setApodo('');
   }

   const clickMarkerEvent = (e)=>{
      console.log(e.lngLat);
      if(marker !== null) marker.remove();
      setLocation(e.lngLat);
      marker = new mapboxgl
         .Marker({color: "#ce3f3f"})
         .setLngLat(e.lngLat)
         .addTo(map);
   }

   const setupEventForMap = ()=>{
      if(map !== undefined) map.on('click', clickMarkerEvent);
   }

   const releaseMapEvents = ()=>{
      if(marker !== null) marker.remove();
      if(map !== undefined) map.off('click', clickMarkerEvent);
   }

   const submitHandler = (e)=>{
      e.preventDefault();
      setSaving(true);

      axios.post('api/add', {
         id: id,
         nombre: nombre,
         seudonimo: apodo,
         lat: location.lat,
         long: location.lng
      })
         .then((res)=>{
            setSaving(false);
            cancelWizard();
         })
         .catch((err)=>{
            console.log(err);
         });
   }

   return (
      <>
         {!reduced ? (
            <>
               <h4 className="text-white mt-3">No tienes estadios registrados</h4>
               <a href="#!" className="button mt-3" onClick={startWizard}>Agregar estadio</a>
            </>
         ) : ''}
         <div className={`wizard-nav ${wizardActive ? 'show' : ''}`}>
            <h5>Selecciona una ubicación</h5>
            <span className="d-inline-block mb-3">Haz clic en el mapa para ubicar tu estadio</span>
            <button href="#!" className="button mb-3" disabled={location === null} onClick={()=>{setLocationSelected(true)}}>Seleccionar <FontAwesomeIcon icon={faLocationArrow}/></button>
            <a href="#!" className="button small background-blue" onClick={cancelWizard}>Cancelar <FontAwesomeIcon icon={faTimes}/></a>
         </div>
         <Modal modalOpened={locationSelected} toggleModalAction={cancelWizard}>
            <h5 className="mb-3">Complete la información de su estadio</h5>
            <Form onSubmit={submitHandler}>
               <label for="exampleInputEmail1">Ubicación</label>
               <div className="row mb-2">
                  <div className="col">
                     <label for="exampleInputEmail1">Latitud</label>
                     <Input type="text" className="form-control w-100" name="latitud" value={location !== null ? location.lat : 0} disabled
                        validations={[required]}/>
                  </div>
                  <div className="col">
                     <label for="exampleInputEmail1">Longitud</label>
                     <Input type="text" className="form-control w-100" name="longitud" value={location !== null ? location.lng : 0} disabled
                        validations={[required]}/>
                  </div>
               </div>
               <div className="form-group w-100">
                  <label for="exampleInputEmail1">Nombre del Estadio</label>
                  <Input type="text" className="form-control w-100" name="nombre" value={nombre} onChange={(e)=>{setNombre(e.target.value)}}
                     validations={[required]}/>
               </div>
               <div className="form-group w-100">
                  <label for="exampleInputEmail1">Apodo</label>
                  <Select name="apodo" class="form-control" id="exampleFormControlSelect1"
                     validations={[required]} value={apodo} onChange={(e)=>{setApodo(e.target.value)}}>
                     <option value="El epico">El épico</option>
                     <option value="El sobado">El sobado</option>
                     <option value="El macizo">El macizo</option>
                     <option value="El loco">El loco</option>
                     <option value="El maracanazo">El maracanazo</option>
                     <option value="El gol de oro">El gol de oro</option>
                     <option value="El Maradona">El Maradona</option>
                     <option value="El grande">El grande</option>
                     <option value="El legendario">El legendario</option>
                     <option value="El de Ronaldiño">El de Ronaldiño</option>
                     <option value="La leyenda">La leyenda</option>
                  </Select>
               </div>
               <Button type="submit" className="button">Guardar</Button>
            </Form>
         </Modal>
         <Loader show={saving}/>
      </>
   )
}
