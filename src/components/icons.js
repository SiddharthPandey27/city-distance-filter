import L from 'leaflet';

const iconCenter = new L.Icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/000000/marker.png',
    iconRetinaUrl: 'https://img.icons8.com/plasticine/100/000000/marker.png',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
});

const iconLocation = new L.Icon({
    iconUrl: 'https://img.icons8.com/doodle/96/000000/marker--v5.png',
    iconRetinaUrl: 'https://img.icons8.com/doodle/96/000000/marker--v5.png',
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    className: 'leaflet-div-icon'
});

export { iconCenter, iconLocation };