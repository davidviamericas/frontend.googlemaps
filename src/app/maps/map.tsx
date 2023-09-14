import React from "react";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const Map = (props: any) => {
    const render = (status: Status) => {
        return <h1>{status}</h1>;
    };

    const center = {
        lat: props.lat || -3.745,
        lng: props.lng || -38.523
    };

    const containerStyle = {
        width: '500px',
        height: '500px'
    };

    const [map, setMap] = React.useState<any>(null)

    const onLoad = React.useCallback(function callback(map : any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map : any) {
        setMap(null)
    }, [])


    return <Wrapper apiKey={"google-maps-api-key"} render={render}>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={9}
            onLoad={onLoad}
            onUnmount={onUnmount}
            ref={map}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    </Wrapper>

}

export default Map;
