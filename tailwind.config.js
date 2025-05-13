module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  // Désactive le reset CSS de Tailwind pour éviter les conflits avec Bootstrap
  corePlugins: {
    preflight: false, // 👈 Important !
  },
  theme: {
    extend: {},
  },
  plugins: [],
}