import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/dist/Entypo';
const RoomDetails = ({route, navigation}) => {
  const {roomName} = route.params;
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
  const handleRoomPress = assetName => {
    navigation.navigate('AssetDetails', {roomName, assetName});
  };
  return (
    <View>
      <View style={styles.currectpageView}>
        <Text style={styles.bottomViewTextsValues}>
          {'Rooms > Assets'}
        </Text>
      </View>
      {roomData &&
        roomData.rooms.map((data, index) => {
          if (data.name === roomName) {
            return (
              <View key={index}>
                {data.assets.map((asset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listBackGround}
                    onPress={() => handleRoomPress(asset.name)}>
                    <Text style={styles.text}>{asset.name}</Text>
                    <Icon name="chevron-right" size={30} color="#000000" />
                  </TouchableOpacity>
                ))}
              </View>
            );
          }
        })}
    </View>
  );
};

export default RoomDetails;

const styles = StyleSheet.create({
  currectpageView:{
    padding:10,
    backgroundColor:'#BFC4CE'
  },
  bottomViewTextsValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  listBackGround: {
    width: 'auto',
    height: height * 0.1,
    backgroundColor: '#92D050',
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
});
