import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    '6075-217-199-144-40.ngrok-free.app',
    '*.ngrok-free.app',
    'https://6075-217-199-144-40.ngrok-free.app',
    'https://*.ngrok-free.app',
    'wss://*.ngrok-free.app',
    'wss://6075-217-199-144-40.ngrok-free.app',
    'localhost:3000'
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.ngrok-free.app', '6075-217-199-144-40.ngrok-free.app'],
    },
  },
};

export default nextConfig;
