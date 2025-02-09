import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: "https://kaleidoscopic-pony-1cd7f7.netlify.app/" }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
