
import React, { Component } from 'react';
import { Animated, Image, Platform, StyleSheet,DatePickerIOS, View, TouchableOpacity,Text, TextInput,ListView ,ImageBackground} from 'react-native';

import data from './data';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';


const STATUS_BAR_HEIGHT = Platform.select({ ios: 0, android: 0 });

const AnimatedListView = Animated.createAnimatedComponent(ListView);

export default class CollapsibleScreen extends Component {
     NAVBAR_HEIGHT=100;
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const scrollAnim = new Animated.Value(0);
    
   
    this.state = {
      dataSource: dataSource.cloneWithRows(data),
      scrollAnim,
     
      adVanceSearchClickAnim:new Animated.Value(-300),
      searchIconRotateAnim:new Animated.Value(0),
      navBarHeightChangeAnim:new Animated.Value(0),
      isAdvSearchOpened:false,
      chosenDate: new Date(),
      clampedScroll: Animated.diffClamp(
       
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
        
        0,
       this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
    };
  }


  _getAdvanceSearchComponent=(advSearchTranslate,advSearchOpacity)=>{
    
    
   
    return this.state.isAdvSearchOpened? 
        (
        
<Animated.View style={[styles.AdvancedSearch,
{opacity:advSearchOpacity},
{ transform: [
{translateX:this.state.adVanceSearchClickAnim}
] }]
}>
          <View style={styles.dateInput}>
             
                 <Icon
                  name='date-range' 
                  size={22} 
                  style={styles.searchIcon} 
                  color='#bbb'
                /> 
                <TextInput 
                  style={styles.inputText}
                  placeholder={'From date...'}
                  placeholderTextColor={'#999'}
                  underlineColorAndroid={'#fff'}
                  autoCorrect={false}
                  onFocus={() => {
                    //animation.expandBar();
                    this.props.changeInputFocus('search');
                  }}
                  ref={(inputSearch) => {
                    this.inputSearch = inputSearch;
                  }}
                />
              </View>

              <View style={styles.dateInput}>
             
             <Icon
              name='date-range' 
              size={22} 
              style={styles.searchIcon} 
              color='#bbb'
            /> 
            <TextInput 
              style={styles.inputText}
              placeholder={'To Date...'}
              placeholderTextColor={'#999'}
              underlineColorAndroid={'#fff'}
              autoCorrect={false}
              onFocus={() => {
                //animation.expandBar();
                this.props.changeInputFocus('search');
              }}
              ref={(inputSearch) => {
                this.inputSearch = inputSearch;
              }}
            />
          </View>


        {/* <DatePickerIOS style={styles.datePicker}
          date={this.state.chosenDate}
          onDateChange={this.setDate}
        /> */}
      </Animated.View>

    )
    
:null;
    }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <ImageBackground key={rowId} style={styles.row} source={{ uri: rowData.image }} resizeMode="cover">
        <Text style={styles.rowText}>{rowData.title}</Text>
      </ImageBackground>
    );
  };
  setDate = (newDate)=>{
   this.setState({
       ...this.state,
       chosenDate:newDate
   });
  }

  toggleAdvanceSearch=()=>{
    Animated.timing(                  // Animate over time
      this.state.adVanceSearchClickAnim,            // The animated value to drive
      {
        toValue: !this.state.isAdvSearchOpened?0:-300,                   // Animate to opacity: 1 (opaque)
        duration: 300,   
        useNativeDriver: true,           // Make it take a while
      }
    ).start(); 

    Animated.timing(                  // Animate over time
      this.state.searchIconRotateAnim,            // The animated value to drive
      {
        toValue: this.state.isAdvSearchOpened?0:1,                   // Animate to opacity: 1 (opaque)
        duration: 150,   
        useNativeDriver: true,           // Make it take a while
      }
    ).start(); 
  
    Animated.timing(                  // Animate over time
      this.state.navBarHeightChangeAnim,            // The animated value to drive
      {
        toValue: this.state.isAdvSearchOpened?0:1,                   // Animate to opacity: 1 (opaque)
        duration: 150,   
        useNativeDriver: true,           // Make it take a while
      }
    ).start(); 
  
    if(this.state.isAdvSearchOpened){
setTimeout(() => {
  this.setState(prevState=>{
   // this.NAVBAR_HEIGHT=prevState.isAdvSearchOpened?100:130
   
      return {
        ...this.state,
        isAdvSearchOpened:!prevState.isAdvSearchOpened,
      //  NAVBAR_HEIGHT:prevState.isAdvSearchOpened?100:120
        
     }
    
     
  });
}, 250);
    }else {
      this.setState(prevState=>{
      //  this.NAVBAR_HEIGHT=prevState.isAdvSearchOpened?100:130
       
          return {
            ...this.state,
            isAdvSearchOpened:!prevState.isAdvSearchOpened,
          //  NAVBAR_HEIGHT:prevState.isAdvSearchOpened?100:120
            
         }
        });
    }
   

  }


  render() {
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [0, -(this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
      extrapolate: 'clamp',
    });

    const navbarOpacityTranslate = this.state.navBarHeightChangeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1,1],
    
    });

    const advSearchTranslate = clampedScroll.interpolate({
        inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [0, -(this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
        extrapolate: 'clamp',
      });
      const advSearchOpacity = clampedScroll.interpolate({
        inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, this.NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const spinAnimation= this.state.searchIconRotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

   
    return (
      <View style={styles.fill}>
      <Animated.View >
        <AnimatedListView
         
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          scrollEventThrottle={1}
         
          
          onScrollEndDrag={this._onScrollEndDrag}
          onScroll={
             
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                { useNativeDriver: true },
              //  { listener: this._handleListViewScroll },
              )
          
        }
        />
        </Animated.View>
        <Animated.View style={[styles.navbar,{ transform: [{ translateY: navbarTranslate }] }]}>
        
          <Animated.View style={[styles.searchContainer, { opacity: navbarOpacity }]}>
          <Animated.View style={[
              styles.arrowMinimizeContainer, 
              {transform: [{rotate: spinAnimation},{perspective:1000}]}
            ]}>
              <TouchableOpacity onPress={() => {
              //  animation.minimizeBar();
               this.toggleAdvanceSearch()
              //  this.blurInputs();
              }}>
                { <Icon
                  name= {this.state.isAdvSearchOpened? 'keyboard-arrow-up': 'keyboard-arrow-down'}
                  size={36} 
                  style={styles.arrowMinimizeIcon} 
                  color='#A9A9A9'
                /> }
              </TouchableOpacity>
            </Animated.View>

          <View style={styles.searchInput}>
             
                 <Icon
                  name='search' 
                  size={22} 
                  style={styles.searchIcon} 
                  color='#bbb'
                /> 
                <TextInput 
                  style={styles.inputText}
                  placeholder={'Search by tags...'}
                  placeholderTextColor={'#999'}
                  underlineColorAndroid={'#fff'}
                  autoCorrect={false}
                  onFocus={() => {
                    //animation.expandBar();
                    this.props.changeInputFocus('search');
                  }}
                  ref={(inputSearch) => {
                    this.inputSearch = inputSearch;
                  }}
                />
              </View>
          </Animated.View>
         {this._getAdvanceSearchComponent(advSearchTranslate,advSearchOpacity)}

        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    
    backgroundColor: '#efefef',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
   
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
  },

  title: {
    color: '#333333',
  },
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
  searchContainer: {
    zIndex: 99,
    paddingTop: 10,
    width: '100%',
    overflow: 'hidden',
    paddingBottom: 10,
   display:'flex',
  
   flexDirection:'row'
   
  },
  arrowMinimizeContainer: {
    position: 'relative',

    
  },
  arrowMinimizeIcon: {
    marginLeft: 5,
  },
  searchInput: {
   // display: 'flex',
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 45,
    width:'80%',
    marginLeft: 5,
    marginRight: 5,
    
   
  },
  dateInput:{
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 45,
    width:'50%',
    marginLeft: 5,
    marginRight: 5,
  },
  AdvancedSearch: {
     display: 'flex',
     flexDirection:'row',
     backgroundColor: '#fff',
     
     height: 45,
     //width:'100%',
     marginLeft: 5,
     marginRight: 5,
     
    
   },
  locationInput: {
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: 12,
  },
  datePicker :{
      zIndex:999,
      backgroundColor:'#eee'
  },
  inputText: {
    
    marginTop: 13,
    marginLeft: 43,
    fontSize: 15,
    color: '#999',
    width:'100%'
  }
});


