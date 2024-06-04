import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  PermissionsAndroid,
  ToastAndroid
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
const {height, width} = Dimensions.get('window');
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dropdown} from 'react-native-element-dropdown';
import AssetInfo1 from '../utils/AssetsInfo.json';
import Data1 from '../utils/Data.json';
import FileIcon from 'react-native-vector-icons/AntDesign';
import Tools from 'react-native-vector-icons/Entypo';
import Camera from 'react-native-vector-icons/Entypo';
import Images from 'react-native-vector-icons/Ionicons';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";

const data = [
  {label: 'Active', value: 'Active'},
  {label: 'DeActive', value: 'DeActive'},
  {label: 'Not Working', value: 'Not Working'},
];

const assetsData = [
  {
    category: 'Furniture',
    items: [
      'Sofa',
      'Dining table',
      'Chairs',
      'Beds',
      'Wardrobes',
      'Desks and tables',
      'Bookshelves',
      'Cabinets and drawers',
    ],
  },
  {
    category: 'Kitchen Appliances',
    items: [
      'Refrigerator',
      'Oven',
      'Stove or cooktop',
      'Dishwasher',
      'Coffee maker',
      'Toaster',
      'Blender',
      'Food processor',
    ],
  },
  {
    category: 'Electronic Devices',
    items: [
      'Television (TV)',
      'Computer',
      'Smartphone',
      'Tablet',
      'Printer',
      'Speaker systems',
      'Gaming consoles',
      'Home theater systems',
    ],
  },
];
const manufacturersData = [
  {
    category: 'Furniture Manufacturers',
    items: [
      'ABC Furniture Co.',
      'XYZ Furnishings',
      'Modern Designs',
      'Classic Creations',
    ],
  },
  {
    category: 'Kitchen Appliances Manufacturers',
    items: ['KitchenPro', 'ApplianceMasters', 'CookingTech', 'HomeChef'],
  },
  {
    category: 'Electronic Devices Manufacturers',
    items: [
      'TechGuru',
      'ElectroTech',
      'SmartDevices Inc.',
      'Digital Innovations',
    ],
  },
];

const RenderItem = ({item, onPress}) => {
  const [pressedData, setpressedData] = useState(item[1]);
  const handleAdditionInfo = () => {
    if (pressedData === 'Yes') {
      setpressedData('No');
    } else {
      setpressedData('Yes');
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.additionalInfoQuesOuterView}>
        <View style={styles.additioninfoquetionView}>
          <Text style={[styles.bottomViewTextsValues]}>{item[0]}</Text>
        </View>
        <View style={styles.radiobuttonOuterView}>
          <View>
            <View style={styles.radibuttonView}>
              <Text style={styles.normalText}>Yes</Text>
              <TouchableOpacity
                style={
                  pressedData == 'Yes'
                    ? styles.radiobuttonSelected
                    : styles.radiobuttonNotSelected
                }
                onPress={() => handleAdditionInfo()}></TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.radibuttonView}>
              <Text style={styles.normalText}>No</Text>
              <TouchableOpacity
                style={
                  pressedData == 'No'
                    ? styles.radiobuttonSelected
                    : styles.radiobuttonNotSelected
                }
                onPress={() => handleAdditionInfo()}></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const AssetDetails = ({route, navigation}) => {
  const [AssetInfo, setAssetInfo] = useState(null);
  const [Data, setData] = useState(null);
  const [value, setValue] = useState('item 4');
  const [isFocus, setIsFocus] = useState(false);
  const {roomName, assetName} = route.params;
  const [assetNameInput, setAssetNameInput] = useState('');
  const [additionInfoSelected, setadditionInfoSelected] = useState(null);
  const [isMobileAsset, setisMobileAsset] = useState();
  const [sheetType, setsheetType] = useState(null);
  const [AssetClass, setAssetClass] = useState();
  const [ManufacturerData, setManufacturerData] = useState();
  const [galleryImageUri, setGalleryImageUri] = useState(null);

  const uri ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr7qlOx_nl2sEIPh8Drm8MY2wsFjOpNxfbvmChTFBS8Q&s";

  const refRBSheet = useRef();
  let isMobileAssetVer = '';
  useEffect(() => {
    setAssetInfo(AssetInfo1);
    setData(Data1);
  }, []);

  const room = Data?.rooms.find(room => room.name === roomName);
  const asset = room?.assets.find(asset => asset.name === assetName);
  const additionalInfo = asset?.additional_info
    ? Object.entries(asset.additional_info)
    : [];

  const additionInfoPressed = ({item}) => {
    return (
      <RenderItem
        item={item}
        onPress={() => setadditionInfoSelected(item[1])}
      />
    );
  };

  const handleIsMobileAsset = ({event}) => {
    if (event === 'Yes') {
      setisMobileAsset('No');
      isMobileAssetVer = 'No';
      console.log('data', isMobileAssetVer);
    } else {
      setisMobileAsset('Yes');
      isMobileAssetVer = 'Yes';
      console.log('data', isMobileAssetVer);
    }
  };

  const handleOpenSheet = sheetType => {
    setsheetType(sheetType);
    refRBSheet.current.open();
  };

  const RenderAssetClassData = () => {
    const renderItem = ({item}) => (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        {item.items.map(asset => (
          <TouchableOpacity
            onPress={() => {
              setAssetClass(asset);
              refRBSheet.current.close();
            }}>
            <Text style={styles.assetItem} key={asset}>
              {asset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
      <FlatList
        data={assetsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 20}}
      />
    );
  };
  const RenderSystemParentData = () => {
    return (
      <View style={{backgroundColor: 'red', width: '100%'}}>
        <Text style={styles.normalText}>Content for Sheet 2</Text>
      </View>
    );
  };

  const RenderManufacturerData = () => {
    const renderItem = ({item}) => (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        {item.items.map(asset => (
          <TouchableOpacity
            onPress={() => {
              setManufacturerData(asset);
              refRBSheet.current.close();
            }}>
            <Text style={styles.assetItem} key={asset}>
              {asset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
      <FlatList
        data={manufacturersData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 20}}
      />
    );
  };

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'App needs access to your gallery.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, open gallery
        launchGallery();
      } else {
        ToastAndroid.show('Gallery permission denied!', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = () => {
    console.log("open Gallery")
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      .then((result) => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission already granted, open gallery
          console.log("Grandted")
          launchGallery();
        } else {
          // Permission not granted, request permission
          console.log("denide")
          requestGalleryPermission();
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const launchGallery = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        // setSelectedImage(imageUri);
        console.log(imageUri)
        setGalleryImageUri(imageUri)
      }
    });
  };

  const launch = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }

    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    launchCamera(options, (response) => {
      try {
        // console.warn(options)
        const data = response.assets;
        console.log("Response = ", data[0].fileName);
        const source = { uri: response.uri };
        // console.log('response', JSON.stringify(response));
        ImageData.fileName = response.filename;
        ImageData.fileData = response.data;
        ImageData.fileUri = response.uri;
        // ImageData({
        //   ImageData[filePath]: response,
        //   fileData: response.data,
        //   fileUri: response.uri
        // });
        console.log(ImageData);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const renderSheetContent = sheetType => {
    switch (sheetType) {
      case 'Asset Class':
        return <RenderAssetClassData />;
      case 'System Parent':
        return <RenderSystemParentData />;
      case 'Manufacture':
        return <RenderManufacturerData />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {asset && (
          <View style={styles.container}>

            <View style={styles.currectpageView}>
              <Text style={styles.bottomViewTextsValues}>{"Rooms > Assets > Details"}</Text>
            </View>

            <View style={styles.ImageView}>
              <Image
                source={{
                  uri: galleryImageUri==null?uri:galleryImageUri,
                }}
                style={styles.assetImage}
              />
            </View>

            <View style={styles.additionInfoView}>
              <Text style={styles.bottomViewTextsValues}>Additional Info:</Text>
              <FlatList
                data={additionalInfo}
                keyExtractor={(item, index) => index.toString()}
                renderItem={additionInfoPressed}
              />
            </View>

            <View style={styles.captureImageView}>
              <View style={styles.toolsOuterView}>
                <TouchableOpacity style={styles.toolsView}>
                  <Tools name="tools" size={30} color="#7F7F7F" />
                </TouchableOpacity>
              </View>
              <View style={styles.cameraOuterView}>
                <TouchableOpacity style={styles.imagesView} onPress={()=> openGallery()}>
                  <Images name="images-outline" size={30} color="#7F7F7F" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cameraView} onPress={()=> launch()}>
                  <Camera name="camera" size={30} color="#7F7F7F" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tableTopView}>
              <View style={styles.assetsLayout1}>
                <Text style={[styles.headingText, {marginRight: 10}]}>
                  Orignal
                </Text>
              </View>
              <View style={styles.assetsLayout2}></View>
              <View style={styles.assetsLayout3}>
                <Text style={styles.headingText}>Update</Text>
                {Data &&
                  Data.rooms.map(data => {
                    if (data.name === roomName) {
                      data.assets.map(assets => {
                        if (assets.name === assetName) {
                        }
                      });
                    }
                  })}
              </View>
              <View style={styles.assetsLayout4}></View>
            </View>

            <View style={styles.tableView}>
              <View style={styles.assetsInfoOriganlLayout}>
                <FlatList
                  data={AssetInfo && AssetInfo.AssetsInfoOrignal}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <View>
                      <View style={styles.assetsOrignalLayoutUnder}>
                        <Text style={styles.normalText}>{item}</Text>
                      </View>
                      <View style={styles.line} />
                    </View>
                  )}
                />
              </View>
              <View style={styles.assetsInfoAssetsNamesLayout}>
                {AssetInfo &&
                  AssetInfo.AssetsInfo.map((data, index) => {
                    return (
                      <View key={index}>
                        <View style={styles.assetsOrignalLayoutUnder}>
                          <View
                            style={
                              index < 4
                                ? styles.assetsInfoLayout
                                : styles.assetsInfoLayoutdisable
                            }>
                            <Text
                              style={index > 3 ? styles.mobileAssetText : null}>
                              {data}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line} />
                      </View>
                    );
                  })}
                <View style={{marginTop: 10}}>
                  <Text style={styles.mobileAssetText}>Mobile Asset ?</Text>
                </View>
              </View>
              <View style={styles.assetsInfoUpdateLayout}>
                <View>
                  <TouchableOpacity
                    style={styles.assetUpdateUnderLayout}
                    onPress={() => handleOpenSheet('Asset Class')}>
                    <Text style={styles.assetclasstext}>
                      {AssetClass == null ? asset.name : AssetClass}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.line} />

                  <View style={styles.assetUpdateUnderLayout}>
                    <TextInput
                      style={styles.textInput}
                      value={assetNameInput || asset.assetname}
                      placeholderTextColor="#aaa"
                      onChangeText={text => setAssetNameInput(text)}
                    />
                  </View>
                  <View style={styles.line} />

                  <View style={styles.assetUpdateUnderLayout}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.inputSearchStyle}
                      data={data}
                      labelField="label"
                      valueField="value"
                      placeholder={asset.name}
                      placeholderStyle={styles.selectedTextStyle}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={styles.line} />

                  <TouchableOpacity
                    style={styles.assetUpdateUnderLayout}
                    onPress={() => handleOpenSheet('System Parent')}>
                    <Text style={styles.assetclasstext}>
                      {asset.systemParent}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.line} />

                  <View style={styles.assetUpdateUnderLayout}>
                    <Dropdown
                      style={styles.dropdown}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.inputSearchStyle}
                      data={data}
                      labelField="label"
                      valueField="value"
                      placeholder={asset.name}
                      placeholderStyle={styles.selectedTextStyle}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                  <View style={styles.line} />

                  <TouchableOpacity
                    style={styles.assetUpdateUnderLayout}
                    onPress={() => handleOpenSheet('Manufacture')}>
                    <Text style={styles.assetclasstext}>
                      {ManufacturerData == null
                        ? asset.manufacturer
                        : ManufacturerData}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.line} />

                  <View style={styles.assetUpdateUnderLayout}>
                    <TextInput
                      style={styles.textInput}
                      value={assetNameInput || asset.model}
                      placeholderTextColor="#aaa"
                      onChangeText={text => setAssetNameInput(text)}
                    />
                  </View>
                  <View style={styles.line} />

                  <View style={styles.assetUpdateUnderLayout}>
                    <TextInput
                      style={styles.textInput}
                      value={assetNameInput || asset.serialNo}
                      placeholderTextColor="#aaa"
                      onChangeText={text => setAssetNameInput(text)}
                    />
                  </View>
                  <View style={styles.line} />

                  <View style={styles.mobileAssetLayout}>
                    <TouchableOpacity
                      style={
                        (isMobileAsset === null
                          ? asset?.isMobileAsset
                          : isMobileAsset) === 'Yes'
                          ? styles.mobileAssetYesButton
                          : styles.mobileAssetNoButton
                      }
                      onPress={() => handleIsMobileAsset('No')}>
                      <Text
                        style={
                          (isMobileAsset === null
                            ? asset?.isMobileAsset
                            : isMobileAsset) === 'Yes'
                            ? styles.mobileAssetYesButtonText
                            : styles.mobileAssetNoButtonText
                        }>
                        No
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        (isMobileAsset === null
                          ? asset?.isMobileAsset
                          : isMobileAsset) === 'No'
                          ? styles.mobileAssetYesButton
                          : styles.mobileAssetNoButton
                      }
                      onPress={() => {
                        console.log(isMobileAsset);
                        handleIsMobileAsset('Yes');
                      }}>
                      <Text
                        style={
                          (isMobileAsset === null
                            ? asset?.isMobileAsset
                            : isMobileAsset) === 'No'
                            ? styles.mobileAssetYesButtonText
                            : styles.mobileAssetNoButtonText
                        }>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <RBSheet
                    ref={refRBSheet}
                    height={height * 0.7}
                    draggable
                    dragOnContent
                    closeOnPressBack
                    closeOnPressMask
                    customStyles={{
                      wrapper: {
                        backgroundColor: 'tranparent',
                        borderStartEndRadius: 30,
                      },
                      draggableIcon: {
                        backgroundColor: '#000',
                        height: 4,
                      },
                      container: {
                        backgroundColor: '#FFFFFF',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      },
                    }}
                    customModalProps={{
                      animationType: 'none',
                      statusBarTranslucent: true,
                    }}
                    customAvoidingViewProps={{
                      enabled: false,
                    }}>
                    {renderSheetContent(sheetType)}
                  </RBSheet>
                </View>
              </View>
              <View style={styles.assetsInfoSaveLayout}>
                {AssetInfo &&
                  AssetInfo.AssetsInfoOrignal.map((data, index) => {
                    return (
                      <View key={index}>
                        <View style={styles.assetsSaveLayoutUnder}>
                          <TouchableOpacity
                            style={[
                              styles.SaveIconView,
                              {
                                backgroundColor:
                                  index == 1 ? '#0174F4' : '#BFBFBF',
                              },
                            ]}>
                            <FileIcon
                              name={index == 1 ? 'filetext1' : 'file1'}
                              size={15}
                              color="#000000"
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                      </View>
                    );
                  })}
              </View>
            </View>
            <View style={[styles.line, {marginTop: 20}]} />

            <View style={styles.bottomView}>
              <View style={styles.rightBottomView}>
                <Text style={styles.bottomViewTextsValues}>Comments</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  style={styles.commentstextInput}
                  textAlignVertical="top"
                />
              </View>
              {asset && (
                <View style={styles.leftBottomView}>
                  <View style={styles.leftBottomUnderView}>
                    <Text style={styles.bottomViewTexts}>Installed Date</Text>
                    <Text style={styles.mobileAssetText}>
                      {asset.Installed_date}
                    </Text>
                  </View>
                  <View style={styles.leftBottomUnderView}>
                    <Text style={styles.bottomViewTexts}>
                      Currect Condition
                    </Text>
                    <Text style={styles.mobileAssetText}>
                      {asset.Currect_condition}
                    </Text>
                  </View>
                  <View style={styles.leftBottomUnderView}>
                    <Text style={styles.bottomViewTexts}>Legacy Asset No</Text>
                    <Text style={styles.mobileAssetText}>
                      {asset.Legacy_asset_no}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssetDetails;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  currectpageView:{
    padding:10,
    backgroundColor:'#BFC4CE'
  },
  ImageView: {
    width: '100%',
    backgroundColor: '#E4E3E4',
  },
  assetImage: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  additionInfoView: {
    margin: 20,
  },
  additionalInfoQuesOuterView: {
    flexDirection: 'row',
  },
  additioninfoquetionView: {
    marginRight: 10,
    alignItems: 'flex-end',
    flex: 1,
    marginTop: 15,
    justifyContent: 'center',
  },
  radiobuttonOuterView: {
    flexDirection: 'row',
    flex: 1.5,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radibuttonView: {
    flexDirection: 'row',
    marginLeft: '10%',
    marginRight: '10%',
  },
  radiobuttonNotSelected: {
    height: 20,
    width: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C1C0C1',
    marginLeft: 10,
  },
  radiobuttonSelected: {
    height: 20,
    width: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 6,
    borderColor: '#0174F4',
    marginLeft: 10,
  },
  captureImageView:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center',
    marginBottom:20
  },
  toolsOuterView:{
    flex:1,
    alignItems:'flex-end',
    marginRight:'5%'
  },
  toolsView:{
    backgroundColor:'#BFBFBF',
    padding:5,
    borderRadius:7,
    borderWidth:1,
    borderColor:'#7F7F7F'
  },
  imagesView:{
    backgroundColor:'#BFBFBF',
    padding:5,
    borderRadius:7,
    borderWidth:1,
    borderColor:'#7F7F7F',
    marginRight:"2%"
  },
  cameraView:{
    backgroundColor:'#BFBFBF',
    padding:5,
    borderRadius:7,
    borderWidth:1,
    borderColor:'#7F7F7F',
    marginLeft:'2%'
  },
  cameraOuterView:{
    flex:1,
    flexDirection:'row',
    marginLeft:'5%'
  },

  tableTopView: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#BFC4CE',
  },
  assetsLayout1: {
    flex: 0.7,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assetsLayout2: {
    flex: 1,
  },
  assetsLayout3: {
    flex: 1,
    justifyContent: 'center',
  },
  assetsLayout4: {
    flex: 0.5,
  },
  assetsInfoLayout: {
    borderRadius: 5,
    backgroundColor: '#92D050',
    padding: 3,
    height: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetsInfoLayoutdisable: {
    borderRadius: 5,
    backgroundColor: '#BFBFBF',
    padding: 3,
    height: 30,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetsInfoOriganlLayout: {
    flex: 0.7,
  },
  assetsInfoAssetsNamesLayout: {
    flex: 1,
  },
  assetsInfoUpdateLayout: {
    flex: 1,
  },
  assetsInfoSaveLayout: {
    flex: 0.5,
  },
  assetsOrignalLayoutUnder: {
    height: 40,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },
  assetsSaveLayoutUnder: {
    height: 40,
    alignItems: 'flex-start',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  SaveIconView: {
    backgroundColor: '#BFBFBF',
    padding: 7,
    borderRadius: 5,
  },
  tableView: {
    flexDirection: 'row',
  },
  normalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
  },
  headingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#8c8b87',
  },
  assetUpdateUnderLayout: {
    height: 40,
    justifyContent: 'center',
  },
  assetclasstext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#58a0ed',
    textDecorationLine: 'underline',
  },
  textInput: {
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 3,
    borderColor: '#b5b5b5',
    color: '#000000',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#FFFFFF',
  },
  dropdown: {
    height: 30,
    borderColor: '#b5b5b5',
    borderWidth: 0.5,
    borderRadius: 3,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 5,
    height: 30,
    zIndex: 999,
    paddingTop: 5,
    fontSize: 14,
    color: '#000000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'red',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#58a0ed',
  },

  inputSearchStyle: {
    fontSize: 14,
    color: '#000000',
  },
  bottomView: {
    width: '100%',
    marginTop: 10,
  },
  leftBottomView: {
    alignSelf: 'center',
    width: '80%',
  },
  rightBottomView: {
    alignSelf: 'center',
    width: '90%',
  },
  leftBottomUnderView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  bottomViewTexts: {
    fontSize: 14,
    fontWeight: '500',
    color: '#58a0ed',
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  bottomViewTextsValues: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  commentstextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  mobileAssetLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  mobileAssetNoButton: {
    height: 20,
    width: '40%',
    backgroundColor: '#E4E3E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  mobileAssetYesButton: {
    height: 20,
    width: '40%',
    backgroundColor: '#0174F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  mobileAssetNoButtonText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
  mobileAssetYesButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  mobileAssetText: {
    color: '#6A696A',
    alignSelf: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  assetItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
  },
});
