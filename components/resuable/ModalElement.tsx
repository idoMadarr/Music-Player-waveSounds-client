import React from 'react';
import {Modalize} from 'react-native-modalize';
import Colors from '../../assets/design/palette.json';
import {PropDimensions} from '../../dimensions/dimensions';

interface ModalElementType {
  children: JSX.Element | JSX.Element[] | string;
  modalizeRef: any;
}

const ModalElement: React.FC<ModalElementType> = ({children, modalizeRef}) => {
  return (
    <Modalize
      modalStyle={{backgroundColor: Colors.primary}}
      ref={modalizeRef}
      avoidKeyboardLikeIOS={true}
      closeSnapPointStraightEnabled={false}
      useNativeDriver={true}
      closeOnOverlayTap={true}
      modalHeight={PropDimensions.maxModalHeight}>
      {children}
    </Modalize>
  );
};

export default ModalElement;
