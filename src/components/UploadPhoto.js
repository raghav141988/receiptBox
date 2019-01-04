/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import React from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import UploadPhotoItem from './UploadPhotoItem';
import {
  Button,
  Icon,
} from 'react-native-elements';

import { colors } from '../Utils/theme';

const { width, height } = Dimensions.get('window');
let styles = {};

class UploadPhoto extends React.Component {

  state = {
    selectedImageIndex: null,
  }
  componentDidMount() {
    // @todo - refactor into redux, we probably don't need to be setting state in componentDidMount,
    // but for now we need to duplicate this state in this component for UI purposes.
    let { selectedImageIndex } = this.props.data;
    if (selectedImageIndex) {
      this.setState(() => ({ selectedImageIndex }))
    };
  }
  updateSelectedImage = (image, index) => {
    //const { updateSelectedImage } = this.props.;
    this.props.updateSelectedImage(image, index);
    if (index === this.state.selectedImageIndex) {
      index = null;
    }
    this.setState(() => ({ selectedImageIndex: index }));
  }
  _keyExtractor = (item, index) => index.toString();//item.receiptId;

 
  render() {
    const { selectedImageIndex } = this.state;
    const { images, selectedImage } = this.props.data;

    return (
      <View>
        <View style={styles.imageContainer}>
          <FlatList contentContainerStyle={styles.scrollViewContainer}
            data={images}
            onEndReached={this.props.fetchMorePhotos}
            onEndReachedThreshold={100}
            keyExtractor={this._keyExtractor}
            renderItem={(info) => (
              <UploadPhotoItem
              item={info.item}
              index={info.index}
              updateSelectedImage={()=>this.updateSelectedImage(info.item,info.index)}
             
            />)
            }
          />     
        </View>   
      </View>
    )
  }
}

styles = StyleSheet.create({
  imageContainer: {
    width,
    height: height - 60,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

export default UploadPhoto;
