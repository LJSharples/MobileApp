import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { Camera } from "expo-camera";
import { Storage } from 'aws-amplify';
import { t } from 'react-native-tailwindcss';

export default function FileUpload(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [cameraRef, setCameraRef] = useState(null)

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
                <View style={[ t.alignCenter, t.justifyCenter]}>
                    <TouchableOpacity
                        style={{
                            flex:0.1,
                            alignSelf: 'flex-end',
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                            );
                        }}>
                            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white'}}> Flip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={async() => {
                        if(cameraRef){
                            let photo = await cameraRef.takePictureAsync();
                            const imageName = photo.uri.replace(/^.*[\\\/]/, '');
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
                    }}>
                        <View style={{ 
                            borderWidth: 2,
                            borderRadius:"50%",
                            borderColor: 'white',
                            height: 50,
                            width:50,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                borderWidth: 2,
                                borderRadius:"50%",
                                borderColor: 'white',
                                height: 40,
                                width:40,
                                backgroundColor: 'white'}} >
                            </View>
                        </View> 
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}