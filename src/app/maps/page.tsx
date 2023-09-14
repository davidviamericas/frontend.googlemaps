'use client'
import * as React from 'react';

import styles from '../page.module.css'

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import axios from 'axios';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';

import Map from './map';

type AutocompleteType = {
  description: string
}

export default function Maps() {

  const [address, setAddress] = React.useState<string>("");
  const [location, setLocation] = React.useState<Array<any>>([]);
  const [optionsSelect, setOptionsSelect] = React.useState<Array<any>>([]);
  const [typingTimeout, setTypingTimeout] = React.useState<any>(null);
  const [token, setToken] = React.useState<string>("");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }

  const getLocations = async () => {
    try {
      const path = "https://dev-vianex.viamericas.io/USA000006/google-maps-api";//`http://localhost:3001/autocomplete`;
      const data = {
        "address": address,
        "event": "autocomplete", // autocomplete - geocode
        "countries": ["us"] // ISO 3166-1 Alpha-2 compatible country code
      }
      const response = await axios.post(path, data, {headers: headers});
      setOptionsSelect(response.data);
    }
    catch (err) {
      console.error(err);
    }
  }

  const getGeocode = async (completeAddress: string) => {
    try {
      const path = `https://dev-vianex.viamericas.io/USA000006/google-maps-api`;
      const data = {
        "address": completeAddress,
        "event": "geocode", // autocomplete - geocode
      }
      const response = await axios.post(path, data, { headers: headers });
      console.log("getGeocode => ", response.data);
      setLocation(response.data);
    }
    catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    if (address.trim() !== "") {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const newTypingTimeout = setTimeout(() => {
        // Llama a la API con el valor actual del input
        getLocations();
      }, 250);

      // Actualiza el estado con el nuevo temporizador
      setTypingTimeout(newTypingTimeout);
    }
  }, [address]);

  const getInfo = (property: string): string => {
    let value: string = "";
    if (location.length > 0) {
      const components = location[0].address_components;
      value = components.find((x: any) => x.types.includes(property))?.long_name || "";
    }

    return value;
  }

  return (
    <div className={styles.main}>
      <TextField style={{marginBottom: "10px", width: "350px"}} label="Token" onChange={(e) => setToken(e.target.value)}></TextField>
      <Autocomplete
        autoComplete={true}
        autoHighlight
        style={{ border: "1px solid #FFF" }}
        onChange={(event, newValue) => {
          //console.log(newValue);
          getGeocode(newValue.description);
        }}
        onInputChange={(event, newInputValue) => {
          setAddress(newInputValue);
        }}
        id="combo-box-demo"
        options={optionsSelect}
        getOptionLabel={(option) => option.description}
        sx={{ width: 350 }}
        renderOption={(props, option) => (
          <Typography variant="body1" {...props}>
            {option.description}
          </Typography>
        )}
        filterOptions={(options) => options}
        renderInput={(params) => <TextField {...params} label="Address" />}
      />

      <Typography variant='h5' style={{ marginTop: "15px" }}>
        <Typography variant='h6'>Address: <label style={{ fontSize: "20px", fontWeight: "100" }}>{location[0]?.formatted_address}</label></Typography>
        <Typography variant='h6'>Country: <label style={{ fontSize: "20px", fontWeight: "100" }}>{getInfo("country")}</label></Typography>
        <Typography variant='h6'>State: <label style={{ fontSize: "20px", fontWeight: "100" }}>{getInfo("administrative_area_level_1")}</label></Typography>
        <Typography variant='h6'>City: <label style={{ fontSize: "20px", fontWeight: "100" }}>{getInfo("administrative_area_level_2")}</label></Typography>
        <Typography variant='h6'>PostalCode: <label style={{ fontSize: "20px", fontWeight: "100" }}>{getInfo("postal_code")}</label></Typography>
        <Typography variant='h6'>Long / Lat: <label style={{ fontSize: "20px", fontWeight: "100" }}>{`${location[0]?.geometry.location.lng} / ${location[0]?.geometry.location.lat}`}</label></Typography>

      </Typography>

      <Map lng={location[0]?.geometry.location.lng} lat={location[0]?.geometry.location.lat} />

    </div>
  )
}
