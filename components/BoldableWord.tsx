import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

type ChildProps = {
  bold: boolean;
  style?: StyleProp<TextStyle>;
  text: string;
};

const Word: React.FC<ChildProps> = ({ bold, style, text }) => {
  const OFFSET = bold ? 0.4 : 0;

  return (
    <View style={styles.container}>
      {/* Outline layer (black) */}
      <Text
        style={[
          style,
          styles.outline,
          styles.offset,
          { top: -OFFSET, left: -OFFSET },
        ]}
      >
        {text}
      </Text>
      <Text
        style={[
          style,
          styles.outline,
          styles.offset,
          { top: -OFFSET, left: OFFSET },
        ]}
      >
        {text}
      </Text>
      <Text
        style={[
          style,
          styles.outline,
          styles.offset,
          { top: OFFSET, left: -OFFSET },
        ]}
      >
        {text}
      </Text>
      <Text
        style={[
          style,
          styles.outline,
          styles.offset,
          { top: OFFSET, left: OFFSET },
        ]}
      >
        {text}
      </Text>

      {/* Foregrounstyle,  text (white) */}
      <Text style={[style, styles.foreground]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  offset: {
    position: "absolute",
  },
  outline: {
    // base style
  },
  foreground: {},
});

export default Word;
