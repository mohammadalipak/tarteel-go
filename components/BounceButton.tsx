import { MotiView } from "moti";
import React, { useState } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

interface BounceButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scale?: number;
}

const BounceButton: React.FC<BounceButtonProps> = ({
  children,
  onPress,
  style,
  disabled = false,
  scale = 0.7,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={style}
    >
      <MotiView
        animate={{
          scale: isPressed ? scale : 1,
        }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 300,
        }}
      >
        {children}
      </MotiView>
    </TouchableOpacity>
  );
};

export default BounceButton;
