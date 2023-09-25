/** @type {import('next').NextConfig} */

const withImages = require('next-images');

module.exports = withImages({
  webpack(config, options) {
    return config;
  },
  images: {
    disableStaticImages: false,
  },
  experimental: {
    appDir: true,
    serverActions: true,
  },
});
// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.module.rules.push({
//         test: /\.(jpe?g|png|gif|svg)$/i,
//         loader: 'url-loader',
//         options: {
//           limit: false, // Disable inline image limit
//           publicPath: '/.next/static/images', // Set your preferred public path
//           outputPath: 'static/images', // Set your preferred output path
//           name: '[name].[hash].[ext]'
//         }
//       });
//     }

//     return config;
//   },
//   experimental: {
//     appDir: true,
//   },
// };

