mixins.aplayer = {
  data() {
    return {
      audio: [
        {
          name: "光るなら", // 歌曲名称
          artist: "Goose house", // 歌曲作者
          url: "/music/lieInApr.mp3", // 歌曲url地址
          cover: "/music/lieInApr.jpg", // 歌曲封面
          lrc: "/music/lieInApr.lrc", // 歌词
          theme: "#fff", // 主题
        }
      ],
      info: {
        fixed: true, // 开启吸底模式
        listFolded: true, // 折叠歌曲列表
        autoplay: false, // 开启自动播放
        preload: "auto", // 自动预加载歌曲
        loop: "all", // 播放循环模式、all全部循环 one单曲循环 none只播放一次
        order: "list", //  播放模式，list列表播放, random随机播放
        lrcType: 3, //使用lrc歌词
        volume: 0.1, // 播放音量
      }
    }
  },
  mounted() {
    this.initAudio()
  },
  methods: {
    initAudio() {
      new APlayer({
        container: document.getElementById("aplayer"),
        audio: this.audio, // 音乐信息
        ...this.info, // 其他配置信息
      })
    }
  }
}