import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/SearchBus.css";
import BusTimeline from "./BusTimeline";
import LiveBusTracker from "./LiveBustracker";
const locations = ["Hyderabad", "Vijayawada", "Rajampet", "Tirupati"];
const busTypes = ["All Types", "AC", "Non-AC", "Ultra Deluxe", "Express" ];
const sampleBuses = [
  {
    id: 1,
    name: "Garuda",
    type: "AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "9:00 PM",
    arrival: "6:00 AM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "9:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "9:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Nalgonda", time: "10:30 PM", lat: 17.05, lng: 79.27 },
      { stop: "Kodad", time: "12:00 AM", lat: 16.99, lng: 79.97 },
      { stop: "Suryapet", time: "12:45 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "2:00 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "6:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 2,
    name: "Garuda Plus",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Tirupati",
    departure: "6:00 AM",
    arrival: "2:00 PM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [5, 10, 11],
    routeStops: [
      { stop: "Hyderabad", time: "6:00 AM", lat: 17.385, lng: 78.4867 },
      { stop: "Nalgonda", time: "7:30 AM", lat: 17.05, lng: 79.27 },
      { stop: "Miryalaguda", time: "8:30 AM", lat: 16.8722, lng: 79.5625 },
      { stop: "Guntur", time: "10:00 AM", lat: 16.3067, lng: 80.4365 },
      { stop: "Ongole", time: "12:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "2:00 PM", lat: 14.44, lng: 79.99 },
      { stop: "Naidupeta", time: "3:30 PM", lat: 13.9046, lng: 79.8969 },
      { stop: "Srikalahasti", time: "4:15 PM", lat: 13.7499, lng: 79.6984 },
      { stop: "Tirupati", time: "5:00 PM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 3,
    name: "Amaravati",
    type: "AC",
    from: "Vijayawada",
    to: "Rajampet",
    departure: "5:00 PM",
    arrival: "11:00 PM",
    fare: 550,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Guntur", time: "6:00 PM", lat: 16.3067, lng: 80.4365 },
      { stop: "Ongole", time: "7:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Kavali", time: "8:00 PM", lat: 14.9163, lng: 79.9945 },
      { stop: "Nellore", time: "8:30 PM", lat: 14.44, lng: 79.99 },
      { stop: "Rapur", time: "9:30 PM", lat: 14.2052, lng: 79.6132 },
      { stop: "Rajampet", time: "11:00 PM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 4,
    name: "Ultra Deluxe",
    type: "Non-AC",
    from: "Tirupati",
    to: "Rajampet",
    departure: "5:00 AM",
    arrival: "8:30 AM",
    fare: 400,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "5:00 AM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "5:20 AM", lat: 13.6368, lng: 79.5126 },
      { stop: "Mamanduru", time: "5:50 AM", lat: 13.6986, lng: 79.3486 },
      { stop: "Kodur", time: "7:15 AM", lat: 14.1176, lng: 79.5503 },
      { stop: "Pullampeta", time: "8:00 AM", lat: 14.2731, lng: 79.1953 },
      { stop: "Rajampet", time: "8:30 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
  id: 5,
  name: "Vennela",
  type: "AC",
  from: "Hyderabad",
  to: "Rajampet",
  departure: "7:30 PM",
  arrival: "6:00 AM",
  fare: 600,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Hyderabad", time: "7:30 PM", lat: 17.385, lng: 78.4867 },
    { stop: "LB Nagar", time: "8:00 PM", lat: 17.35, lng: 78.5667 },
    { stop: "Mahbubnagar", time: "9:30 PM", lat: 16.7481, lng: 77.9863 },
    { stop: "Kurnool", time: "11:30 PM", lat: 15.8281, lng: 78.0373 },
    { stop: "Nandyal", time: "1:00 AM", lat: 15.4883, lng: 78.4847 },
    { stop: "Kadapa", time: "4:00 AM", lat: 14.4673, lng: 78.8242 },
    { stop: "Rajampet", time: "6:00 AM", lat: 14.195, lng: 79.166 },
  ],
},
{
  id: 6,
  name: "Super Luxury",
  type: "AC",
  from: "Vijayawada",
  to: "Hyderabad",
  departure: "8:00 PM",
  arrival: "5:00 AM",
  fare: 500,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Vijayawada", time: "8:00 PM", lat: 16.5062, lng: 80.648 },
    { stop: "Khammam", time: "11:30 PM", lat: 17.2473, lng: 80.1514 },
    { stop: "Suryapet", time: "1:00 AM", lat: 17.14, lng: 79.62 },
    { stop: "Kodad", time: "1:45 AM", lat: 16.99, lng: 79.97 },
    { stop: "Nalgonda", time: "2:30 AM", lat: 17.05, lng: 79.27 },
    { stop: "LB Nagar", time: "4:30 AM", lat: 17.35, lng: 78.5667 },
    { stop: "Hyderabad", time: "5:00 AM", lat: 17.385, lng: 78.4867 },
  ],
},
{
  id: 7,
  name: "Express",
  type: "Non-AC",
  from: "Vijayawada",
  to: "Tirupati",
  departure: "9:00 PM",
  arrival: "6:30 AM",
  fare: 480,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Vijayawada", time: "9:00 PM", lat: 16.5062, lng: 80.648 },
    { stop: "Tenali", time: "9:45 PM", lat: 16.2428, lng: 80.6405 },
    { stop: "Ongole", time: "11:30 PM", lat: 15.5057, lng: 80.0499 },
    { stop: "Nellore", time: "2:00 AM", lat: 14.4426, lng: 79.9865 },
    { stop: "Naidupeta", time: "4:00 AM", lat: 13.9053, lng: 79.8961 },
    { stop: "Renigunta", time: "5:45 AM", lat: 13.6368, lng: 79.5072 },
    { stop: "Tirupati", time: "6:30 AM", lat: 13.6288, lng: 79.4192 },
  ],
},
{
  id: 8,
  name: "Telangana Express",
  type: "Non-AC",
  from: "Rajampet",
  to: "Hyderabad",
  departure: "6:30 PM",
  arrival: "5:00 AM",
  fare: 600,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Rajampet", time: "6:30 PM", lat: 14.195, lng: 79.166 },
    { stop: "Kadapa", time: "8:00 PM", lat: 14.4673, lng: 78.8242 },
    { stop: "Nandyal", time: "10:00 PM", lat: 15.4883, lng: 78.4847 },
    { stop: "Kurnool", time: "12:00 AM", lat: 15.8281, lng: 78.0373 },
    { stop: "Mahbubnagar", time: "2:30 AM", lat: 16.7481, lng: 77.9863 },
    { stop: "LB Nagar", time: "4:30 AM", lat: 17.35, lng: 78.5667 },
    { stop: "Hyderabad", time: "5:00 AM", lat: 17.385, lng: 78.4867 },
  ],
},
{
  id: 9,
  name: "Krishna Express",
  type: "AC",
  from: "Rajampet",
  to: "Vijayawada",
  departure: "7:00 PM",
  arrival: "5:30 AM",
  fare: 530,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Rajampet", time: "7:00 PM", lat: 14.195, lng: 79.166 },
    { stop: "Kadapa", time: "8:00 PM", lat: 14.4673, lng: 78.8242 },
    { stop: "Nellore", time: "11:00 PM", lat: 14.4426, lng: 79.9865 },
    { stop: "Ongole", time: "1:00 AM", lat: 15.5057, lng: 80.0499 },
    { stop: "Tenali", time: "4:30 AM", lat: 16.2428, lng: 80.6405 },
    { stop: "Vijayawada", time: "5:30 AM", lat: 16.5062, lng: 80.648 },
  ],
},
{
  id: 10,
  name: "Tirupati Rajadhani",
  type: "Non-AC",
  from: "Rajampet",
  to: "Tirupati",
  departure: "6:00 PM",
  arrival: "9:00 PM",
  fare: 200,
  totalSeats: 36,
  bookedSeats: [],
  routeStops: [
    { stop: "Rajampet", time: "6:00 PM", lat: 14.195, lng: 79.166 },
    { stop: "Kodur", time: "7:00 PM", lat: 14.117, lng: 79.55 },
    { stop: "Renigunta", time: "8:30 PM", lat: 13.6368, lng: 79.5072 },
    { stop: "Tirupati", time: "9:00 PM", lat: 13.6288, lng: 79.4192 },
  ],
},
{
    id: 11,
    name: "Garuda",
    type: "AC",
    from: "Hyderabad",
    to: "Tirupati",
    departure: "8:30 PM",
    arrival: "6:30 AM",
    fare: 650,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "8:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "9:00 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "12:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "4:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Tirupati", time: "6:30 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 12,
    name: "Garuda Plus",
    type: "Non-AC",
    from: "Tirupati",
    to: "Hyderabad",
    departure: "7:00 PM",
    arrival: "5:00 AM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [3, 8, 14],
    routeStops: [
      { stop: "Tirupati", time: "7:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Kadapa", time: "9:00 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "12:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "LB Nagar", time: "4:30 AM", lat: 17.35, lng: 78.5667 },
      { stop: "Hyderabad", time: "5:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 13,
    name: "Amaravati",
    type: "AC",
    from: "Vijayawada",
    to: "Rajampet",
    departure: "6:00 PM",
    arrival: "2:00 AM",
    fare: 570,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "6:00 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Ongole", time: "8:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "11:00 PM", lat: 14.4426, lng: 79.9865 },
      { stop: "Kadapa", time: "1:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "2:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 14,
    name: "Ultra Deluxe",
    type: "Non-AC",
    from: "Rajampet",
    to: "Vijayawada",
    departure: "7:30 PM",
    arrival: "4:30 AM",
    fare: 490,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "7:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "9:00 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Nellore", time: "12:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "2:30 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "4:30 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 15,
    name: "Vennela",
    type: "AC",
    from: "Hyderabad",
    to: "Rajampet",
    departure: "9:00 PM",
    arrival: "7:00 AM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "9:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "Kurnool", time: "12:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Nandyal", time: "2:00 AM", lat: 15.4883, lng: 78.4847 },
      { stop: "Kadapa", time: "5:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "7:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 16,
    name: "Super Luxury",
    type: "AC",
    from: "Tirupati",
    to: "Vijayawada",
    departure: "10:00 PM",
    arrival: "7:00 AM",
    fare: 580,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "10:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Naidupeta", time: "11:30 PM", lat: 13.9053, lng: 79.8961 },
      { stop: "Nellore", time: "1:30 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "4:30 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "7:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 17,
    name: "Express",
    type: "Non-AC",
    from: "Vijayawada",
    to: "Hyderabad",
    departure: "8:00 PM",
    arrival: "5:00 AM",
    fare: 520,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "8:00 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Khammam", time: "11:00 PM", lat: 17.2473, lng: 80.1514 },
      { stop: "Suryapet", time: "1:00 AM", lat: 17.14, lng: 79.62 },
      { stop: "LB Nagar", time: "4:30 AM", lat: 17.35, lng: 78.5667 },
      { stop: "Hyderabad", time: "5:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 18,
    name: "Telangana Express",
    type: "Non-AC",
    from: "Rajampet",
    to: "Tirupati",
    departure: "6:00 PM",
    arrival: "9:30 PM",
    fare: 250,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "6:00 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kodur", time: "7:15 PM", lat: 14.117, lng: 79.55 },
      { stop: "Renigunta", time: "9:00 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Tirupati", time: "9:30 PM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 19,
    name: "Krishna Express",
    type: "AC",
    from: "Tirupati",
    to: "Rajampet",
    departure: "5:00 AM",
    arrival: "8:00 AM",
    fare: 220,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "5:00 AM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "5:30 AM", lat: 13.6368, lng: 79.5072 },
      { stop: "Kodur", time: "6:30 AM", lat: 14.117, lng: 79.55 },
      { stop: "Rajampet", time: "8:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 20,
    name: "Tirupati Rajadhani",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "11:00 PM",
    arrival: "6:00 AM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "11:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "Suryapet", time: "1:30 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "2:30 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "6:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 21,
    name: "Garuda",
    type: "AC",
    from: "Tirupati",
    to: "Hyderabad",
    departure: "9:00 PM",
    arrival: "7:00 AM",
    fare: 670,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "9:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "9:30 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Kadapa", time: "1:30 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "4:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Hyderabad", time: "7:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 22,
    name: "Garuda Plus",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Rajampet",
    departure: "8:00 PM",
    arrival: "6:00 AM",
    fare: 590,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "8:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "8:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "12:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "4:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "6:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 23,
    name: "Amaravati",
    type: "AC",
    from: "Vijayawada",
    to: "Hyderabad",
    departure: "10:30 PM",
    arrival: "7:00 AM",
    fare: 550,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "10:30 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Khammam", time: "1:30 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Suryapet", time: "3:00 AM", lat: 17.14, lng: 79.62 },
      { stop: "LB Nagar", time: "6:30 AM", lat: 17.35, lng: 78.5667 },
      { stop: "Hyderabad", time: "7:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 24,
    name: "Ultra Deluxe",
    type: "Non-AC",
    from: "Rajampet",
    to: "Tirupati",
    departure: "4:30 PM",
    arrival: "7:30 PM",
    fare: 230,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "4:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kodur", time: "5:30 PM", lat: 14.117, lng: 79.55 },
      { stop: "Renigunta", time: "7:00 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Tirupati", time: "7:30 PM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 25,
    name: "Vennela",
    type: "AC",
    from: "Tirupati",
    to: "Vijayawada",
    departure: "8:00 PM",
    arrival: "5:00 AM",
    fare: 590,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "8:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Naidupeta", time: "9:45 PM", lat: 13.9053, lng: 79.8961 },
      { stop: "Nellore", time: "11:30 PM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "3:00 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "5:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 26,
    name: "Super Luxury",
    type: "AC",
    from: "Rajampet",
    to: "Hyderabad",
    departure: "7:30 PM",
    arrival: "6:00 AM",
    fare: 620,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "7:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "9:00 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Nandyal", time: "12:00 AM", lat: 15.4883, lng: 78.4847 },
      { stop: "Kurnool", time: "2:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Hyderabad", time: "6:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 27,
    name: "Express",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "6:30 PM",
    arrival: "3:30 AM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "6:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "7:00 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Suryapet", time: "12:00 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "1:30 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "3:30 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 28,
    name: "Telangana Express",
    type: "Non-AC",
    from: "Vijayawada",
    to: "Tirupati",
    departure: "7:00 PM",
    arrival: "4:00 AM",
    fare: 520,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "7:00 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Ongole", time: "9:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "12:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Naidupeta", time: "2:30 AM", lat: 13.9053, lng: 79.8961 },
      { stop: "Tirupati", time: "4:00 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 29,
    name: "Krishna Express",
    type: "AC",
    from: "Rajampet",
    to: "Vijayawada",
    departure: "6:30 PM",
    arrival: "4:30 AM",
    fare: 540,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "6:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "8:30 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Nellore", time: "12:30 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "2:30 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "4:30 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 30,
    name: "Tirupati Rajadhani",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Tirupati",
    departure: "10:00 PM",
    arrival: "7:30 AM",
    fare: 630,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "10:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "10:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "2:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "5:30 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Tirupati", time: "7:30 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 31,
    name: "Garuda",
    type: "AC",
    from: "Hyderabad",
    to: "Tirupati",
    departure: "7:30 PM",
    arrival: "6:00 AM",
    fare: 640,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "7:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "8:00 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "11:00 PM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "3:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Tirupati", time: "6:00 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 32,
    name: "Garuda Plus",
    type: "Non-AC",
    from: "Tirupati",
    to: "Hyderabad",
    departure: "9:00 PM",
    arrival: "8:00 AM",
    fare: 650,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "9:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "9:30 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Kadapa", time: "2:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "5:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Hyderabad", time: "8:00 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 33,
    name: "Amaravati",
    type: "AC",
    from: "Vijayawada",
    to: "Rajampet",
    departure: "10:00 PM",
    arrival: "7:00 AM",
    fare: 560,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "10:00 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Ongole", time: "12:00 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "2:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Kadapa", time: "5:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "7:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 34,
    name: "Ultra Deluxe",
    type: "Non-AC",
    from: "Rajampet",
    to: "Vijayawada",
    departure: "8:30 PM",
    arrival: "6:00 AM",
    fare: 520,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "8:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "10:30 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Nellore", time: "1:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "3:00 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "6:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 35,
    name: "Vennela",
    type: "AC",
    from: "Hyderabad",
    to: "Rajampet",
    departure: "6:30 PM",
    arrival: "5:30 AM",
    fare: 610,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "6:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "Mahbubnagar", time: "9:00 PM", lat: 16.7481, lng: 77.9863 },
      { stop: "Kurnool", time: "11:30 PM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "3:30 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "5:30 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 36,
    name: "Super Luxury",
    type: "AC",
    from: "Tirupati",
    to: "Vijayawada",
    departure: "8:00 PM",
    arrival: "6:00 AM",
    fare: 600,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "8:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "8:30 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Nellore", time: "12:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "2:30 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "6:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 37,
    name: "Express",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "11:00 PM",
    arrival: "7:30 AM",
    fare: 510,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "11:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "11:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Suryapet", time: "3:30 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "5:00 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "7:30 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 38,
    name: "Telangana Express",
    type: "Non-AC",
    from: "Rajampet",
    to: "Hyderabad",
    departure: "7:00 PM",
    arrival: "6:30 AM",
    fare: 630,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "7:00 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "9:00 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "1:00 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Mahbubnagar", time: "4:30 AM", lat: 16.7481, lng: 77.9863 },
      { stop: "Hyderabad", time: "6:30 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 39,
    name: "Krishna Express",
    type: "AC",
    from: "Vijayawada",
    to: "Tirupati",
    departure: "9:00 PM",
    arrival: "5:30 AM",
    fare: 590,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "9:00 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Ongole", time: "11:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "1:30 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Naidupeta", time: "3:30 AM", lat: 13.9053, lng: 79.8961 },
      { stop: "Tirupati", time: "5:30 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 40,
    name: "Tirupati Rajadhani",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Rajampet",
    departure: "6:00 PM",
    arrival: "5:00 AM",
    fare: 620,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "6:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "6:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "10:30 PM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "3:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "5:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 41,
    name: "Garuda",
    type: "AC",
    from: "Hyderabad",
    to: "Rajampet",
    departure: "8:00 PM",
    arrival: "6:00 AM",
    fare: 650,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "8:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "8:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "11:30 PM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "3:30 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Rajampet", time: "6:00 AM", lat: 14.195, lng: 79.1669 },
    ],
  },
  {
    id: 42,
    name: "Garuda Plus",
    type: "Non-AC",
    from: "Tirupati",
    to: "Vijayawada",
    departure: "10:00 PM",
    arrival: "6:30 AM",
    fare: 570,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "10:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "10:30 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Naidupeta", time: "1:00 AM", lat: 13.9053, lng: 79.8961 },
      { stop: "Nellore", time: "2:30 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Vijayawada", time: "6:30 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 43,
    name: "Amaravati",
    type: "AC",
    from: "Rajampet",
    to: "Hyderabad",
    departure: "7:00 PM",
    arrival: "6:30 AM",
    fare: 640,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "7:00 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "9:30 PM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "12:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Mahbubnagar", time: "4:00 AM", lat: 16.7481, lng: 77.9863 },
      { stop: "Hyderabad", time: "6:30 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 44,
    name: "Ultra Deluxe",
    type: "Non-AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "11:30 PM",
    arrival: "8:00 AM",
    fare: 500,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "11:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "12:00 AM", lat: 17.35, lng: 78.5667 },
      { stop: "Suryapet", time: "3:00 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "5:00 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "8:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 45,
    name: "Vennela",
    type: "AC",
    from: "Hyderabad",
    to: "Tirupati",
    departure: "9:00 PM",
    arrival: "6:30 AM",
    fare: 670,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "9:00 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "9:30 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Kurnool", time: "12:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Kadapa", time: "3:30 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Tirupati", time: "6:30 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 46,
    name: "Super Luxury",
    type: "AC",
    from: "Vijayawada",
    to: "Tirupati",
    departure: "8:30 PM",
    arrival: "5:30 AM",
    fare: 580,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Vijayawada", time: "8:30 PM", lat: 16.5062, lng: 80.648 },
      { stop: "Ongole", time: "11:00 PM", lat: 15.5057, lng: 80.0499 },
      { stop: "Nellore", time: "2:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Renigunta", time: "4:45 AM", lat: 13.6368, lng: 79.5072 },
      { stop: "Tirupati", time: "5:30 AM", lat: 13.6288, lng: 79.4192 },
    ],
  },
  {
    id: 47,
    name: "Express",
    type: "Non-AC",
    from: "Rajampet",
    to: "Vijayawada",
    departure: "10:00 PM",
    arrival: "7:00 AM",
    fare: 540,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "10:00 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kadapa", time: "12:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Nellore", time: "3:00 AM", lat: 14.4426, lng: 79.9865 },
      { stop: "Ongole", time: "5:00 AM", lat: 15.5057, lng: 80.0499 },
      { stop: "Vijayawada", time: "7:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 48,
    name: "Telangana Express",
    type: "Non-AC",
    from: "Tirupati",
    to: "Hyderabad",
    departure: "8:00 PM",
    arrival: "7:30 AM",
    fare: 660,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Tirupati", time: "8:00 PM", lat: 13.6288, lng: 79.4192 },
      { stop: "Renigunta", time: "8:30 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Kadapa", time: "1:00 AM", lat: 14.4673, lng: 78.8242 },
      { stop: "Kurnool", time: "4:30 AM", lat: 15.8281, lng: 78.0373 },
      { stop: "Hyderabad", time: "7:30 AM", lat: 17.385, lng: 78.4867 },
    ],
  },
  {
    id: 49,
    name: "Krishna Express",
    type: "AC",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "10:30 PM",
    arrival: "7:00 AM",
    fare: 530,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Hyderabad", time: "10:30 PM", lat: 17.385, lng: 78.4867 },
      { stop: "LB Nagar", time: "11:00 PM", lat: 17.35, lng: 78.5667 },
      { stop: "Suryapet", time: "2:00 AM", lat: 17.14, lng: 79.62 },
      { stop: "Khammam", time: "4:00 AM", lat: 17.2473, lng: 80.1514 },
      { stop: "Vijayawada", time: "7:00 AM", lat: 16.5062, lng: 80.648 },
    ],
  },
  {
    id: 50,
    name: "Tirupati Rajadhani",
    type: "Non-AC",
    from: "Rajampet",
    to: "Tirupati",
    departure: "6:30 PM",
    arrival: "9:30 PM",
    fare: 210,
    totalSeats: 36,
    bookedSeats: [],
    routeStops: [
      { stop: "Rajampet", time: "6:30 PM", lat: 14.195, lng: 79.1669 },
      { stop: "Kodur", time: "7:30 PM", lat: 14.117, lng: 79.55 },
      { stop: "Renigunta", time: "9:00 PM", lat: 13.6368, lng: 79.5072 },
      { stop: "Tirupati", time: "9:30 PM", lat: 13.6288, lng: 79.4192 },
    ],
  },
];
function isOvernight(departure, arrival) {
  const parseTime = (t) => {    const [h, m, mer] = t.match(/(\d+):(\d+)\s?(AM|PM)/i).slice(1);
    let hours = parseInt(h);
    if (mer.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (mer.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours;
  };
  return parseTime(arrival) < parseTime(departure);
}
export default function SearchBus() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [stopFilter, setStopFilter] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = () => {
    let filtered = sampleBuses.filter(
      (bus) =>
        bus.from === from &&
        bus.to === to &&
        (typeFilter === "All Types" || bus.type === typeFilter)
    );
    if (stopFilter !== "") {
      filtered = filtered.filter((bus) =>
        bus.routeStops?.some(
          (stop) => stop.stop.toLowerCase() === stopFilter.toLowerCase()
        )
      );
    }
    setResults(filtered);
  };
  const allStops = Array.from(
    new Set(sampleBuses.flatMap((bus) => bus.routeStops.map((stop) => stop.stop)))
  );
  const groupedResults = results.reduce((acc, bus) => {
    const routeKey = `${bus.from} → ${bus.to}`;
    if (!acc[routeKey]) acc[routeKey] = [];
    acc[routeKey].push(bus);
    return acc;
  }, {});

  return (
    <div className="booking-container">
      <div className="search-form">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">From</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">To</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {busTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select value={stopFilter} onChange={(e) => setStopFilter(e.target.value)}>
          <option value="">Filter by Stop</option>
          {allStops.map((stop) => (
            <option key={stop} value={stop}>
              {stop}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      {Object.entries(groupedResults).length === 0 && results.length === 0 && (
        <p style={{ padding: "20px", textAlign: "center" }}>
          No buses found for the selected route.
        </p>
      )}
      {Object.entries(groupedResults).map(([route, buses]) => (
        <div key={route} className="route-group">
          <h3>{route}</h3>
          {buses.map((bus) => {
            const availableSeats = bus.totalSeats - bus.bookedSeats.length;
            const center = bus.routeStops?.[0]
              ? [bus.routeStops[0].lat, bus.routeStops[0].lng]
              : [17.385, 78.4867];
              return (
              <div key={bus.id} className="bus-card">
                <h4>{bus.name}</h4>
                <p>Departure: {bus.departure} | Arrival: {bus.arrival}</p>
                <p>Fare: ₹{bus.fare}</p>
                <p>Seats Available: {availableSeats}</p>
                <p
                  style={{
                    color: isOvernight(bus.departure, bus.arrival) ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {isOvernight(bus.departure, bus.arrival)
                    ? "Overnight Journey"
                    : "Day Journey"}
                </p>
                <div className="stops">
                  <strong>Route Stops:</strong>
                  <BusTimeline stops={bus.routeStops} />
                </div>
                <MapContainer
                  style={{ height: "200px", width: "100%", marginTop: "10px" }}
                  center={center}
                  zoom={7}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Polyline
                    positions={bus.routeStops.map((s) => [s.lat, s.lng])}
                    color="blue"
                  />
                  {bus.routeStops.map((stop, i) => (
                    <Marker key={i} position={[stop.lat, stop.lng]}>
                      <Popup>
                        {stop.stop} - {stop.time}
                      </Popup>
                    </Marker>
                  ))}
                  <LiveBusTracker bus={bus} />
                </MapContainer>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}





