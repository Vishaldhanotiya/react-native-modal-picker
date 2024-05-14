import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Pressable,
  View,
  SafeAreaView,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
} from 'react-native';
import SearchBar from './ModalPicker/SearchBar';
import PickerListItem from './ModalPicker/PickerListItem';
import PickerView from './ModalPicker/PickerView';

const ModalPicker = (props: ModalPickerProps) => {
  const [data, setData] = useState<any[]>(props?.data);
  const [selectedValue, setSelectedValue] = useState();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const searchByNameCode = (searchText: string) => {
    if (/^-{0,1}\d+$/.test(searchText)) {
      var filteredJson = props?.data.filter((item) => {
        return item.name.startsWith(searchText);
      });
    } else {
      var filteredJson = props?.data.filter((item) => {
        const itemData = item.name.toUpperCase() || item.name; // some language can't be uppercase e.g Arabic, Japenese
        const queryText = searchText?.toUpperCase() || searchText;
        return itemData?.includes(queryText);
      });
    }
    setData([...filteredJson]);
  };

  const handleItemOnClick = (item) => {
    setModalVisible(false);
    setSelectedValue(item.name);
    props.onChange && props.onChange(item.name);
  };

  const openModal = (value: boolean) => {
    setModalVisible(value);
    setData(props?.data);
  };

  return (
    <View>
      <PickerView
        {...props}
        openModal={openModal}
        selectedValue={selectedValue}
      />

      <Modal
        transparent
        visible={isModalVisible}
        animationType={props.animationType}
        onRequestClose={() => openModal(false)}>
        <SafeAreaView style={styles.safeAreaView}>
          <Pressable
            style={styles.onPressClose}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.container}>
            <Pressable
              style={styles.closePress}
              onPress={() => {
                setData(data);
                setModalVisible(false);
              }}>
              <View style={styles.backDropStyle} />
            </Pressable>
            {!props.hideSearchBar && (
              <SearchBar {...props} searchByNameCode={searchByNameCode} />
            )}

            <FlatList
              data={data}
              numColumns={1}
              overScrollMode="never"
              initialNumToRender={50}
              style={styles.flatListStyle}
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => (
                <PickerListItem
                  {...item}
                  listTextStyle={props?.listTextStyle}
                  handleItemOnClick={handleItemOnClick}
                />
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};
export default ModalPicker;

export interface ModalPickerProps {
  disable?: boolean;
  onChange?: Function;
  pickerTitle?: string;
  value?: string | any;
  hideSearchBar?: boolean;
  listTextStyle?: TextStyle;
  searchBarStyle?: ViewStyle;
  searchBarPlaceHolder?: string;
  placeholderTextColor?: string;
  dropDownImageStyle?: ImageStyle;
  searchImage?: ImageSourcePropType;
  dropDownImage?: ImageSourcePropType;
  animationType?: 'none' | 'slide' | 'fade' | undefined;
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '80%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    paddingBottom: 30,
    bottom: -30,
  },
  safeAreaView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  onPressClose: {
    flex: 1,
  },
  closePress: {
    alignItems: 'center',
    padding: 10,
  },
  flatListStyle: {
    paddingHorizontal: 15,
  },
  backDropStyle: {
    width: 40,
    height: 3,
    borderRadius: 5,
    backgroundColor: 'grey',
  },
});
