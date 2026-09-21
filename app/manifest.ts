import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'LUNAFAD', short_name: 'LUNAFAD', description: 'The playful, data-first SVP Chain launchpad.', start_url: '/', display: 'standalone', background_color: '#080c14', theme_color: '#080c14', icons: [{ src: '/lunafad-mascot.png', sizes: '512x512', type: 'image/png' }] }
}
