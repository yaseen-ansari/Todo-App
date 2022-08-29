import {parse} from '@babel/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
// import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

var array = [];

(async () => {
  try {
    var array2 = await AsyncStorage.getItem('totalUsers');
    array = JSON.parse(array2);
    if (array == null) {
      array = [];
    }
  } catch (error) {
    console.warn(error);
  }
})();

const ModalOne = props => {
  console.log('Data', props.data);
  var initialFName =
    props.data.clickedData != null ? props.data.clickedData.f_Name : '';
  var initialLName =
    props.data.clickedData != null ? props.data.clickedData.l_Name : '';
  var initialPhone =
    props.data.clickedData != null ? props.data.clickedData.phone : '';
  var initialAge =
    props.data.clickedData != null ? props.data.clickedData.age : '';
  var initialEmail =
    props.data.clickedData != null ? props.data.clickedData.email : '';
  console.log('ClickedData: ', initialFName);
  const [f_Name, setfName] = useState(initialFName);
  const [l_Name, setlName] = useState(initialLName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [age, setAge] = useState(initialAge);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('totalUsers', JSON.stringify(array));
    } catch (error) {
      console.warn(error);
    }
  };

  function phonenumber(phone) {
    var phoneno = /^\d{10}$/;

    return phone.match(phoneno);
  }

  function userAge(age) {
    var user_age = /^\d{2}$/;
    return age.match(user_age);
  }

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const addData = () => {


    if (
      f_Name == '' ||
      l_Name == '' ||
      phone == '' ||
      age == '' ||
      email == ''
    ) {
      console.warn('please fill all the fields first');
      return;
    }

    if (validateEmail(email) == null) {
      alert('please enter valid email');
      return;
    }

    if (!phonenumber(phone)) {
      alert('please enter valid number');
      return;
    }
    if (!userAge(age)) {
      alert('please enter valid age');
      return;
    }

      

    var userObject = {
      f_Name,
      l_Name,
      age,
      email,
      phone,
    };

    if (props.data.clickedData == null) {
      array.push(userObject);
    } else {
      array.map((val, index) => {
        if (val.phone.includes(props.data.clickedData.phone)) {
          array.splice(index, 1, userObject);
        }
      });
    }

    storeData();
    props.getData(array);
    props.hideModal(false);
    setfName('');
    setlName('');
    setAge('');
    setEmail('');
    setPhone('');
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={false}
        visible={props.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          props.setModalVisible(!props.data.modalVisible);
        }}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 70,
          }}>
          <View
            style={{
              width: 320,
              height: 500,
              backgroundColor: 'white',
              borderRadius: 15,
              elevation: 10,
            }}>
            {props.data.clickedData != null ? (
              <Text style={styles.userHeading}>Update User</Text>
            ) : (
              <Text style={styles.userHeading}>Add User</Text>
            )}

            <TextInput
              style={styles.input}
              value={f_Name}
              onChangeText={text => setfName(text)}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={l_Name}
              onChangeText={text => setlName(text)}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={text => setAge(text)}
              placeholder="Age"
              value={age}
              keyboardType="numeric"
            />
           
            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              placeholder="Email"
              value={email}
              
            />
            
            <TextInput
              style={styles.input}
              onChangeText={text => setPhone(text)}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={phone}
            />
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 'auto',
                marginRight: 13,
              }}>
              <View style={styles.buttons}>
                <Pressable onPress={() => props.hideModal()}>
                  <Text style={styles.cancel}>Cancel</Text>
                </Pressable>

                {props.data.clickedData != null ? (
                  <Pressable onPress={() => addData()}>
                    <Text style={styles.ok}>update</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => addData()}>
                    <Text style={styles.ok}>ok</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const App = () => {
  const [data, setData] = useState([]);
  const [clickedData, setClickedData] = useState({
    clickedData: null,
    modalVisible: false,
  });

  useEffect(() => {
    showData();
  }, []);

  //for deleting element
  const deleteData = async key => {
    array = data.filter((val, index) => {
      return index != key;
    });

    await AsyncStorage.setItem('totalUsers', JSON.stringify(array));

    console.log(array.length);
    setData(array);
  };

  const editData = key => {
    const clicked = data[key];

    console.log('Edit Data: ', clicked);
    showModal(clicked);
  };

  function showModal(clickedData) {
    setClickedData({
      modalVisible: true,
      clickedData: clickedData,
    });
  }

  function hideModal() {
    setClickedData({
      modalVisible: false,
      clickedData: null,
    });
  }

  function getData(e) {
    // console.warn(e);
    setData(e);
  }

  async function showData() {
    var data = await AsyncStorage.getItem('totalUsers');
   //console.warn(data)
    if (data == null) {
      data = [];
      setData(data);
    }
    else{
      setData(JSON.parse(data));
    }
    
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.title}>Boppo Technolgies</Text>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 23, color: 'black'}}>
          User
        </Text>
        <Pressable>
          <Text
            onPress={() => showModal(null)}
            style={{
              backgroundColor: '#414e70',
              color: 'white',
              padding: 10,
              borderRadius: 50,
              fontSize: 15,
            }}>
            Add User
          </Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={{paddingBottom: 15 }}>
          {data.map((userData, key) => {
            return (
              <View style={styles.view_data} key={key}>
                <View style={styles.data}>
                  <Text style={styles.details}>
                    First Name: {userData.f_Name}
                  </Text>
                  <Text style={styles.details}>
                    Last Name: {userData.l_Name}
                  </Text>
                  <Text style={styles.details}>Age: {userData.age}</Text>
                  <Text style={styles.details} numberOfLines={1}>Email: {userData.email}</Text>
                  <Text style={styles.details}>Phone no: {userData.phone}</Text>
                </View>
                <View style={styles.data_action}>
                  <Icon
                    name="edit"
                    size={18}
                    onPress={() => editData(key)}
                    style={{marginRight: 2, fontSize: 25}}
                  />
                  <Icon
                    name="delete"
                    onPress={() => deleteData(key)}
                    size={18}
                    style={{fontSize: 25, color: 'red'}}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* <View>
       
        <FlatList 
        
          data={data}
          renderItem={element => {
            return (
              <View style={styles.view_data} key={element.index}>
                <View style={styles.data}>
                  <Text style={styles.details}>
                    First Name: {element.item.f_Name}
                  </Text>
                  <Text style={styles.details}>
                    Last Name: {element.item.l_Name}
                  </Text>
                  <Text style={styles.details}>Age: {element.item.age}</Text>
                  <Text style={styles.details}>
                    Email: {element.item.email}
                  </Text>
                  <Text style={styles.details}>
                    Phone no: {element.item.phone}
                  </Text>
                </View>
                <View style={styles.data_action}>
                  <Icon
                    name="edit"
                    size={20}
                    onPress={() => editData(element.index)}
                    style={{marginRight: 2, fontSize: 30}}
                  />
                  <Icon
                    name="delete"
                    onPress={() => deleteData(element.index)}
                    size={20}
                    style={{fontSize: 30, color: 'red'}}
                  />
                </View>
              </View>
            );
          }}
        />
      </View> */}

      {clickedData.modalVisible && (
        <ModalOne
          hideModal={hideModal}
          array={array}
          data={clickedData}
          getData={getData}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
    padding: 2,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    marginTop: 20,
    elevation: 2,
  },

  details: {
    fontSize: 16,
    width:290
    
  },
  view_data: {
    
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    elevation: 10,
    borderColor: 'gray',
  },
  data: {
    padding: 15,
    width: '82%'
  },
  data_action: {
    flexDirection: 'row',
    marginRight: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  userHeading: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    color: 'black',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    padding: 15,
    
  },
  cancel: {
    backgroundColor: 'white',
    color: 'red',
    marginRight: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 5,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ok: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    elevation: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default App;
