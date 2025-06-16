import { ref } from 'vue'

interface Song {
  path: string
  name: string
  artist?: string
  cover?: string
  duration?: number
}

export default function useMusicLoader() {
  const songs = ref<Song[]>([])

  // TODO: 实现动态扫描public/music目录
  const scanMusicFiles = () => {
    // 暂时返回硬编码的测试数据
    return [
      {
        path: '/music/song1.mp3',
        name: '示例音乐',
        artist: '未知艺术家',
        duration: 180,
      },
    ]
  }

  const loadSongs = () => {
    songs.value = scanMusicFiles()
  }

  return {
    songs,
    loadSongs,
  }
}
