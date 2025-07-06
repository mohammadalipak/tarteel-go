import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type ChildProps = {
  style?: StyleProp<ViewStyle>;
};

const RepetitionSlider: React.FC<ChildProps> = ({ style }) => {
  return <View style={[style, styles.container]}></View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default RepetitionSlider;
