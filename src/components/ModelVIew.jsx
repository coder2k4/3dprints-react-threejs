import {
    Html,
    OrbitControls,
    PerspectiveCamera,
    View,
} from '@react-three/drei';
import {Suspense} from 'react';
import Lights from './Lights';
import {IPhone} from './iPhone';

import * as THREE from 'three';
import Loader from "./Loader.jsx";

const ModelVIew = ({
                       index,
                       groupRef,
                       gsapType,
                       controlRef,
                       setRotationState,
                       item,
                       size,
                   }) => {
    return (
        <View
            index={index}
            id={gsapType}
            className={`
			absolute
			w-full
			h-full
			${index === 2 ? 'right-[-100%]' : ''}
			`}
        >
            {/* Ambient Light*/}
            <ambientLight intensity={0.3}/>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} ref={controlRef}/>

            <Lights/>

            <OrbitControls
                makeDefault
                ref={controlRef}
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.4}
                target={new THREE.Vector3(0, 0, 0)}
                onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
            />

            <group
                ref={groupRef}
                name={`${index === 1}? 'small' : 'large'`}
                position={[0, 0, 0]}
            >
                <Suspense
                    fallback={<Loader/>}
                >
                    <IPhone
                        scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
                        item={item}
                        size={size}
                    />
                </Suspense>
            </group>
        </View>
    );
};

export default ModelVIew;
