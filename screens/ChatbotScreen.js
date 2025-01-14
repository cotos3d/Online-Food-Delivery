import React from 'react';
import { StyleSheet, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

const BOTPRESS_URL = 'http://localhost:8081';
const BOT_ID = 'Delivery-food';

const htmlContent = `
  <script src="${BOTPRESS_URL}/assets/modules/channel-web/inject.js"></script>
  <script>
    window.botpressWebChat.init({
      host: '${BOTPRESS_URL}',
      botId: '${BOT_ID}',
      showWidget: true
    });
  </script>
`;

const ChatbotScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <HTMLView value={<html><body>${htmlContent}</body></html>} />
      </View>

      <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
      <script src="https://files.bpcontent.cloud/2024/12/02/05/20241202055109-WWVW09SV.js"></script>

    </>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatbotScreen;