import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import RoomDetails from './src/screens/RoomDetails';
import AssetDetails from './src/screens/AssetDetails';
import BLEConnection from './src/screens/BLEConnection';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RoomDetails" component={RoomDetails} />
        <Stack.Screen name="AssetDetails" component={AssetDetails} />
        <Stack.Screen name="BleConnection" component={BLEConnection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
