module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  devServer: {
    proxy: 'http://192.168.0.104:8080',
  }
}