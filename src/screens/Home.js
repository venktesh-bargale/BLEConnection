import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/dist/Entypo';
import Data1 from '../utils/Data.json';

const Images = [
  {
    Image: require('../Assets/living_room.jpg'),
  },
  {
    Image: require('../Assets/bedroom.jpg'),
  },
  {
    Image: require('../Assets/kitchen.jpg'),
  },
];

const Home = ({navigation}) => {
  const [roomData, setRoomData] = useState(null);
  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await require('../utils/Data.json');
        setRoomData(response);
      } catch (error) {
        console.log('Error fetching Data', error);
      }
    };
    fectData();
  }, []);

  const handleRoomPress = roomName => {
    navigation.navigate('BleConnection');
    // navigation.navigate('RoomDetails', {roomName});
  };
  return (
    <View>
      <View style={styles.currectpageView}>
        <Text style={styles.bottomViewTextsValues}>{'Rooms'}</Text>
      </View>
      {/* {roomData &&
        roomData.rooms.map((data, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                style={styles.listBackGround}
                onPress={() => handleRoomPress(data.name)}>
                <Text style={styles.text}>{data.name}</Text>
                <Icon name="chevron-right" size={30} color="#000000" />
              </TouchableOpacity>
            </View>
          );
        })} */}

      {roomData && (
        <View style={styles.container}>
          <FlatList
            data={roomData.rooms}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.roomsOuterLayout}>
                <TouchableOpacity
                  style={styles.roomsLayout}
                  onPress={() => handleRoomPress(item.name)}>
                  <Image
                    source={{
                      uri: item.Icon}}
                    style={styles.roomIcons}
                  />
                  <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container:{
    height:"100%",
    backgroundColor:"#FFFFFF"
  },
  currectpageView: {
    padding: 10,
    backgroundColor: '#BFC4CE',
  },
  bottomViewTextsValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  listBackGround: {
    width: 'auto',
    height: height * 0.1,
    backgroundColor: '#77a3d1',
    alignItems: 'center',
    paddingLeft: 20,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
  },
  roomsOuterLayout: {
    width: '50%',
    alignItems: 'center',
  },
  roomIcons: {
    height: 100,
    width: 100,
    marginBottom: 10,
  },
  roomsLayout: {
    backgroundColor: '#0174F4',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1, 
    shadowRadius: 4,
    elevation: 10,
  },
});
