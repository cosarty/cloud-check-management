import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        // directoryAsNamespace: true,
        dts: 'types/components.d.ts',
        dirs: ['src/components'],
      }),
    ],
    css: {
      preprocessorOptions: {
        // 全局样式引入
        scss: {
          additionalData: "@use '@/style/index.scss' as *;",
          // javascriptEnabled: true
        },
      },
    },
    resolve: {
      alias: [{ find: '@', replacement: join(__dirname, 'src') }],
      extensions: ['.js', '.json', '.ts', '.vue'],
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
