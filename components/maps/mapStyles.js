export const mapStyles = [
    {
        name: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    {
        name: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '&copy; ESRI'
    },
    {
        name: "Terrain",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: '&copy; OpenTopoMap'
    },
    {
        name: "Dark Mode",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        attribution: '&copy; CartoDB'
    },
    {
        name: "Watercolor",
        url: "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
        attribution: '&copy; Stamen Design'
    },
    {
        name: "Transport",
        url: "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",
        attribution: '&copy; Thunderforest'
    },
    {
        name: "Cycle Map",
        url: "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",
        attribution: '&copy; Thunderforest'
    },
    {
        name: "Light Mode",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        attribution: '&copy; CartoDB'
    },
    {
        name: "Outdoors",
        url: "https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",
        attribution: '&copy; Thunderforest'
    },
    {
        name: "Humanitarian",
        url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        attribution: '&copy; Humanitarian OpenStreetMap'
    }
];