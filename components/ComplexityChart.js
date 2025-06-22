import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Simple Recharts</title>
    <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/recharts/umd/Recharts.min.js"></script>
  </head>
  <body style="margin:0;padding:0;background:#fff;">
    <div id="root" style="width:100%; height:100vh;"></div>
    <script>
      window.onload = function() {
        const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

        const data = [
          { name: 'A', uv: 400, pv: 2400, amt: 2400 },
          { name: 'B', uv: 300, pv: 1398, amt: 2210 },
          { name: 'C', uv: 200, pv: 9800, amt: 2290 },
          { name: 'D', uv: 278, pv: 3908, amt: 2000 },
          { name: 'E', uv: 189, pv: 4800, amt: 2181 },
        ];

        ReactDOM.render(
          React.createElement(LineChart, { width: 400, height: 300, data: data },
            React.createElement(XAxis, { dataKey: 'name' }),
            React.createElement(YAxis, null),
            React.createElement(CartesianGrid, { strokeDasharray: '3 3' }),
            React.createElement(Tooltip, null),
            React.createElement(Line, { type: 'monotone', dataKey: 'uv', stroke: '#8884d8' }),
            React.createElement(Line, { type: 'monotone', dataKey: 'pv', stroke: '#82ca9d' })
          ),
          document.getElementById('root')
        );
      }
    </script>
  </body>
</html>
`;

export default function SimpleRechartsExample() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ width: Dimensions.get('window').width, height: 350 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#fff',
  },
});
