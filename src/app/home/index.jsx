import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { Redirect } from "expo-router";
import { auth } from "../../firebase";
import styles from "../../styles/Homepage.styles";
import MapHP from "../../components/homepage/MapHP";
import SearchLocation from "../../components/homepage/SearchLocation";
import { TrackMyJourney } from "../../components/homepage/TrackMyJourney";
import SearchContacts from "../../components/homepage/SearchContacts";
import { SearchSavedDestinations } from "../../components/homepage/SearchSavedDestinations";
import { returnUpdatedDestinationList } from "../../services/api";
import { UserContext } from "../../contexts/UserContext";

export default function HomePage() {
  if (!auth.currentUser) {
    return <Redirect href="/login" />;
  }
  const [selectedDestination, setSelectedDestination] = useState({ identifier: 'home', latitude: 51.468100, longitude: -0.187800, radius: 5000, });
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [destinations, setDestinations] = useState([])
  const {currentUser} = useContext(UserContext)

  useEffect(() => {
    returnUpdatedDestinationList(currentUser, setDestinations).then (()=> formatDestinations())
  }, [])

//   useEffect(() => {
// formatDestinations()  }, [destinations])

const formatDestinations = () => {
  const formattedDestinations = destinations.map((destination) => ({
    label: destination.label,
    description: destination.address,
    geometry: {
      location: {
        lat: destination.latitude,
        lng: destination.longitude,
      },
    },
  }));

  setLocations(formattedDestinations)
};
  
  return (
    <SafeAreaView style={styles.container}>
      <SearchLocation 
        placeholder="Where are you going?"
        selectedDestination={selectedDestination} 
        setSelectedDestination={setSelectedDestination}
        query={query}
        setQuery={setQuery}
        locations={locations}
        setLocations={setLocations} />
        {/* <SearchSavedDestinations /> */}
      <SearchContacts setSelectedContacts={setSelectedContacts} />
      <MapHP selectedDestination={selectedDestination} setSelectedDestination={setSelectedDestination} />
      <TrackMyJourney selectedContacts={selectedContacts} selectedDestination={selectedDestination}/>
    </SafeAreaView>
  )
}
      