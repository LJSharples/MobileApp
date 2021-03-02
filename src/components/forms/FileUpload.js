import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import { Camera } from "expo-camera";
import { Storage } from 'aws-amplify';
import { t } from 'react-native-tailwindcss';

export default function FileUpload(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(null)
    const [photoUri, setPhotoUri] = useState(null)

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={type} ref={ref => {
	                setCameraRef(ref);
	            }} autoFocus="on">
                <View style={[t.flexRow, t.mT64, t.justifyAround ]}>
                  <TouchableOpacity onPress={async() => {
                        if(cameraRef){
                            let photo = await cameraRef.takePictureAsync();
                            const imageName = photo.uri.replace(/^.*[\\\/]/, '');
                            console.log(photo.uri);
                            //setPhotoUri(photo.uri);
                            Storage.put(imageName, photo.uri, {
                                level: 'private',
                                contentType: 'jpg'
                            })
                            .then(
                                result => {
                                    console.log(result)
                                    props.fileUploadKey(result.key)
                                })
                            .catch(err => console.log(err));
                        }
                    }} style={[ t.bgWhite, t.roundedLg, t.mT64, t.pX2, t.pY2, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
                    <Text style={[ t.textXl]}> Capture </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={props.modal} style={[ t.bgWhite, t.mT64,  t.roundedLg, t.pX2, t.pY2, t.justifyCenter, t.alignCenter, t.itemsCenter, t.mX6]}>
                    <Text style={[ t.textXl]}> Close </Text>
                  </TouchableOpacity>
                </View>
                <View style={[t.flexRow, t.justifyAround ]}>
                    <Image
                    source={photoUri}
                    resizeMode="cover"
                    />
                </View>
            </Camera>
        </View>
    );
}