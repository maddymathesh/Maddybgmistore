import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "maddy-bgmi-store",
  project: "admin-store",
});
