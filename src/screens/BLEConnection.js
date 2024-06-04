import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
var Buffer = require('buffer/').Buffer 
import {BleManager} from 'react-native-ble-plx';

const BLEConnection = () => {
  const [bleManager] = useState(new BleManager());
  const [deviceId, setDeviceId] = useState(null);
  const characteristicUUID = '909a1401-9693-4920-96e6-893c0157fedd';
  const serviceUUID = '909a1400-9693-4920-96e6-893c0157fedd';

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permission denied', 'Some permissions are denied');
        }
      }
    };

    requestPermissions();
    StartBLEDeviceScan();

    return () => {
      bleManager.destroy();
    };
  }, [bleManager]);

  const StartBLEDeviceScan = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }

      console.log('Found device:', device.name, device.id);
      // Assuming you are looking for a specific device, you can stop scanning once you find it
      if (device.name == 'Pheezee_v1.14.01') {
        // Replace with your actual device name
        bleManager.stopDeviceScan();
        setDeviceId(device.id);
        ConnectToDevice(device.id);
      }
    });
  };

  const ConnectToDevice = async (id) => {
    try {
      const device = await bleManager.connectToDevice(id);
      console.log('Connected to device:', device.name);

      await device.discoverAllServicesAndCharacteristics(); // Discover all services and characteristics

      const characteristic = await device.writeCharacteristicWithoutResponseForService(
        serviceUUID,
        characteristicUUID,
        "0xAA02", // Send initial AA02 byte array
      );

      console.log('Initial characteristic write:', characteristic); // Log for debugging

      const onDataReceived = (error, characteristic) => {
        if (error) {
          console.error('Error receiving data:', error);
          return;
        }

        const receivedData = characteristic.value;
        console.log('Received data:', receivedData);
        console.log('Received data:', characteristic);

        if (receivedData.length === 44 && receivedData[0] === 0x44) {
          // Check if response is 44 bytes and starts with 0x44 (assuming expected response format)
          console.log('Valid response received');

          device.writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID, "0xAA02")
            .then(() => console.log('AA03 written successfully'))
            .catch((error) => console.error('Error writing AA03:', error));
        } else {
          console.warn('Unexpected response from device');
        }
      };

      device.monitorCharacteristicForService(serviceUUID, characteristicUUID, onDataReceived);
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const startNotification = async device => {
    try {
      const peripheralInfo =
        await device.discoverAllServicesAndCharacteristics();
      console.log('Peripheral info:', peripheralInfo);
      //   bleManager.discoverAllServicesAndCharacteristics(deviceId)
      //   .then(device => {
      //     console.log('Services and characteristics discovered:', device);
      //     // Perform read, write, or subscribe operations here
      //   })
        // await device.monitorCharacteristicForService(
        //   '180f',
        //   '2a19',
        //   (error, characteristic) => {
        //     if (error) {
        //       console.error('Error in notification:', error);
        //       return;
        //     }
        //     console.log('Notification data:', characteristic.value);
        //   },
        // );

      await device.monitorCharacteristicForService(
        '909a1400-9693-4920-96e6-893c0157fedd',
        '909a1401-9693-4920-96e6-893c0157fedd',
        (error, characteristic) => {
          if (error) {
            console.error('Error in notification:', error);
            return;
          }
          //   console.log('Notification data:', characteristic.value);
        },
      );

      console.log('Notification started');
    } catch (error) {
      console.error('Error starting notification:', error);
    }
  };

  const ReadData = async () => {
    console.log("Device ID", deviceId);
    
    try {
      const characteristic = await bleManager.readCharacteristicForDevice(deviceId, serviceUUID, characteristicUUID);
    //   console.log('Read characteristic:', characteristic.value);
      const buffer = Buffer.from(characteristic.value);
        
      const decodedValue = characteristic.value

    //   console.log(`Received ${decodedValue} for characteristic`, characteristic);
    //   console.log("Received", decodedValue);
      console.log(`Characteristic object: ${JSON.stringify(characteristic, null, 2)}`);
    } catch (error) {
      console.error('Error reading characteristic:', error);
    }
  
    try {
      // Example: Write to a characteristic
    //   const dataToWrite = Uint8Array.from([0x82, 0x04, 0x01, 0x00, 0x02, 0x01, 0x00, 0x00, 0x00, 0x00, 0x80, 0x01]);
    //   const base64Data = Buffer.from(dataToWrite).toString('base64');
    //   const base64Data = 0xAA02;
      const dataToWrite = Uint8Array.from([0xAA, 0x02]);
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID,
        dataToWrite,
      );
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing characteristic:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => ReadData()}>
        <Text style={styles.text}>BLEConnection</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BLEConnection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
  },
});
