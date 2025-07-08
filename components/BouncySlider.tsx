import { MotiView } from 'moti';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface BouncySliderProps {
  children: React.ReactNode;
  isActive: boolean;
  activeScale?: number;
  inactiveScale?: number;
  style?: StyleProp<ViewStyle>;
}

const BouncySlider: React.FC<BouncySliderProps> = ({
  children,
  isActive,
  activeScale = 3,
  inactiveScale = 1.5,
  style,
}) => {
  return (
    <MotiView
      style={style}
      animate={{
        transform: [
          {
            scaleY: isActive ? activeScale : inactiveScale,
          },
        ],
      }}
      transition={{
        type: 'spring',
        damping: 15,
        mass: 2,
        stiffness: 300,
      }}
    >
      {children}
    </MotiView>
  );
};

export default BouncySlider;