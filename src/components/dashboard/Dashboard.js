import React, { Component } from 'react';
import { Map, Marker, Tooltip, TileLayer } from 'react-leaflet';

import markerLocation from '../locations';
import { iconCenter, iconLocation } from '../icons';

class Dashboard extends Component {

    state = {
        center: {},
        mapLocation: [],
        filterDistance: null,
    };

    componentDidMount() {
        const center = {
            lat: 28.7041,
            long: 77.1025,
            city: "New Delhi",
            description: "Delhi, India’s capital territory, is a massive metropolitan area in the country’s north. In Old Delhi a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people. Nearby is Chandni Chowk, a vibrant bazaar filled with food carts, sweets shops and spice stalls."
        };
        this.setState({
            center: center,
            mapLocation: markerLocation,
        });
    }

    centerLocation = () => {
        const { center } = this.state;

        let coords = [];
        coords.push({
            lat: center.lat,
            long: center.long 
        });

        markerLocation && markerLocation.map((location) => {
            coords.push({
                lat: location.lat,
                long: location.long
            });
        })

        if (coords.length === 1) {
            return coords[0];
        }
        
        let x = 0.0;
        let y = 0.0;
        let z = 0.0;
        
        for (let coord of coords) {
            let latitude = coord.lat * Math.PI / 180;
            let longitude = coord.long * Math.PI / 180;
        
            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        }
        
        let total = coords.length;
        
        x = x / total;
        y = y / total;
        z = z / total;
        
        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);
        
        console.log([
            (centralLatitude * 180 / Math.PI),
            (centralLongitude * 180 / Math.PI)
        ]);
    }

    getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const radiusEarth = 6371; // Radius of the earth in km
        const diffLat = this.deg2rad(lat2-lat1);  // Function to change degree into radius
        const diffLon = this.deg2rad(lon2-lon1); 
        const distanceSum = Math.sin(diffLat/2) * Math.sin(diffLat/2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(diffLon/2) * Math.sin(diffLon/2); 
        const distanceCalc = 2 * Math.atan2(Math.sqrt(distanceSum), Math.sqrt(1-distanceSum)); 
        const distanceInKm = radiusEarth * distanceCalc; // Distance in km
        return distanceInKm;
    }
      
    deg2rad = (deg) => {
        return deg * (Math.PI/180)
    }

    filterCities = (e) => {
        const { center } = this.state;
        let mapLocation = [];
        const filterDistance = e.target.value;
        markerLocation && markerLocation.map((location) => {
            const distance = this.getDistanceFromLatLonInKm(center.lat, center.long, location.lat, location.long);
            if (distance <= filterDistance) {
                mapLocation.push(location);
            }
        });
        this.setState({
            mapLocation: mapLocation
        });
    }

    render() {
        const { center, mapLocation, filterDistance } = this.state;
        const centerLocationMap = this.centerLocation();
        const toolTip = <div>
            <div className="tooltip-heading">{center.city}</div>
            <div className="tooltip-desc">{center.description}</div>
        </div>
        return (
            <div className="dashboard">
                <div className="filter-div">
                    <label className="distance">Enter Distance</label>
                    <input className="filter-input distance-filter" type="text" value={filterDistance && !isNaN(filterDistance)} placeholder="Start Typing Distance in Kms" onChange={this.filterCities} />
                </div>
                <Map
                    style={{ height: "85vh", width: "100%", position: "absolute", bottom: 0 }}
                    zoom={5}
                    center={centerLocationMap && centerLocationMap.length > 0 && !isNaN(centerLocationMap[0]) && !isNaN(centerLocationMap[1]) ? centerLocationMap : [28.7041, 77]}
                >
                    <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker 
                        position={[ center.lat, center.long ]}
                        icon={iconCenter}
                    >
                        <Tooltip direction="center" offset={[-8, -2]}>{toolTip}</Tooltip>
                    </Marker>
                    {
                        mapLocation && mapLocation.map((location, index) => {
                            const toolTip = <div className="">
                                <div className="tooltip-heading">{location.city}</div>
                                <div className="tooltip-desc">{location.description}</div>
                            </div>
                            return (
                                <Marker 
                                    position={[ location.lat, location.long ]}
                                    icon={iconLocation}
                                    key={index}
                                >
                                    <Tooltip direction="top" offset={[-8, -2]}>{toolTip}</Tooltip>
                                </Marker>
                            )
                        })
                    }
                </Map>
            </div>
        );
    }
}

export default Dashboard;