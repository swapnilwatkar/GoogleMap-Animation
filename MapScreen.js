// Swapnil Watkar


import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import imageloc from '../assets/images/ic_green_location.png';
import imagepointer from '../assets/images/pointer1.png';
import imageIndicator from '../assets/images/greenMarker.png';
 
 


export default function MapScreen({ navigation }) {
    let {width, height} = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.003;  
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    const mapRef = useRef()
    const markerRef = useRef()
    const [state, setState] = useState({
        curLoc: {
            latitude: 20.752219999999998,
            longitude: 79.75849777777778,
        },
        destinationCords: {},
        isLoading: false,
        coordinate: new AnimatedRegion({
            latitude: 20.752219999999998,
            longitude: 79.75849777777778,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    })
      
      const [count ,setCount]=useState(0);
      const [locationCount ,setlocationCount]=useState(0);
      const [locationFlag ,setlocationFlag]=useState(0);

    const { curLoc, destinationCords, isLoading, coordinate } = state
    useEffect(() => {   
        getLiveLocation();
     }, [])

 
    const getLiveLocation =  () => {   
        console.log("get live location after 1 second")          
        let i=count;
        i=count+1;
        setCount(i);        
         var locationArray=[             
{latitude:20.752219999999998,longitude:79.75849777777778},
{latitude:20.75269111111111,longitude:79.75815999999999},
{latitude:20.75293111111111,longitude:79.75798222222222}, 
{latitude:20.754004444444444,longitude:79.75805333333334},
{latitude:20.75535111111111,longitude:79.7585688888889},  
{latitude:20.75535111111111,longitude:79.7585688888889},  
{latitude:20.755404444444444,longitude:79.75861333333333},
{latitude:20.755404444444444,longitude:79.75861333333333},
{latitude:20.755404444444444,longitude:79.75861333333333},
{latitude:20.75569555555556,longitude:79.7586488888889},  
{latitude:20.756495555555556,longitude:79.75882666666666},
 
                    
         ];
         setlocationCount(locationArray.length); 
          console.log('locationCount: ',locationCount +' - '+'count: ',count);          
            if(locationArray.length!==count){ 
                if(locationFlag!==1){           
                const { latitude, longitude } =locationArray[i-1];
                console.log('latitude  ', latitude   );
                console.log('longitude  ', longitude   );
                animate(latitude, longitude);
                setState({
                    ...state,
                    curLoc: { latitude, longitude },
                    coordinate: new AnimatedRegion({
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    })
    
                })
              }
              else{
                console.log('setlocationFlag  ', '1'  ); 
              }
         }        
          else{              
            setlocationFlag(1);          
          }
         
    }
 

    useEffect(() => {                
        const interval = setInterval(() => { 
             getLiveLocation()
          
        },1000);
        return () => clearInterval(interval)       
    })
 
       const animate = (latitude, longitude) => {
        const newCoordinate = {latitude, longitude};
        if(Platform.OS == 'android'){
            if(markerRef.current){
            markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
            }
        }else{
            coordinate.timing(newCoordinate).start();
        }
    }

    const onCenter = () => {
        mapRef.current.animateToRegion({
            latitude: curLoc.latitude,
            longitude: curLoc.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

   const changeRegion = (region) => {  
     region=({
        latitude: curLoc.latitude,
        longitude: curLoc.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
       })
         
    }
    return (
       <View style={styles.container}>

            <View style={{ flex: 1 }}>
                <MapView
                 minZoomLevel={4}   
                 maxZoomLevel={16}
                 region={{
                    ...curLoc,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                   }}
                     ref={mapRef}
                     }
                    style={StyleSheet.absoluteFill}
                    
                >
                     <Marker.Animated style={{paddingVertical: 1,paddingHorizontal:1 ,borderRadius: 1, elevation: 1 }}
                        ref={markerRef}
                        coordinate={coordinate}
                        image={ imagepointer}
                    />

                    {Object.keys(destinationCords).length > 0 && (<Marker
                        coordinate={destinationCords}
                        image={imageloc }
                    />)}


                     </MapView>
                     <TouchableOpacity
                     style={{
                         position:'absolute',
                         bottom: 0,
                         right: 0
                     }}
                     onPress={onCenter}
                     >
                         <Image source={imageIndicator} />
                         </TouchableOpacity>   
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomCard: {
        backgroundColor: 'white',
        width: '100%',
        padding: 30,
        borderTopEndRadius: 24,
        borderTopStartRadius: 24
    },
    inpuStyle: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        height: 48,
        justifyContent: 'center',
        marginTop: 16
    }
});
  