// next.config.js – configure Next.js for static export suitable for GitHub Pages
module.exports = {
  // Export as a static site (generates an 'out' directory)
  output: 'export',
  // Ensure URLs end with a trailing slash for GitHub Pages folder serving
  trailingSlash: true,
  // Optional: basePath if your repo name is used as a sub‑path on GitHub Pages
  // basePath: '/booknook-client',
  // assetPrefix: '/booknook-client/',
};
