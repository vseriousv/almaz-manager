# Almaz Manager

A modern web application for managing Outline VPN servers built for Almaz VPN service. This application provides an intuitive interface for server management, key creation, and user access control.

![Almaz Manager](public/android-chrome-192x192.png)

## Features

- **Server Management**: Add, configure, and monitor multiple Outline VPN servers
- **Access Key Management**: Create, delete, and manage access keys for VPN users
- **Data Limit Control**: Set and modify data limits for individual access keys
- **Server Configuration**: Change server name and port settings
- **Multi-language Support**: Available in English and Russian
- **Dark/Light Mode**: Supports both light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 15, React 19, Material UI 7
- **State Management**: React Hooks, Zustand
- **Forms**: React Hook Form with Zod validation
- **Styling**: Emotion, Tailwind CSS
- **API Handling**: Custom API client with proxy for certificate validation bypass
- **Internationalization**: Custom i18n implementation

## Getting Started

### Prerequisites

- Node.js 20.0 or later
- npm or yarn package manager
- Access to Outline VPN servers

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/almaz-manager.git
   cd almaz-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

### Configuration

The application stores server configuration in `almaz-servers.json` at the root of the project. This file is automatically created when you add your first server through the UI.

**Note**: This file is gitignored by default to prevent accidental sharing of API keys.

## Deployment

### Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

### Running in Production

To start the application in production mode:

```bash
npm run start
# or
yarn start
```

## Outline API Integration

Almaz Manager integrates with the Outline VPN API, handling certificate validation issues through a custom proxy implementation. This allows for secure communication with Outline servers even when they use self-signed certificates.

## License

[MIT](LICENSE)

## Acknowledgements

- [Outline VPN](https://getoutline.org/) for providing the underlying VPN technology
- [Next.js](https://nextjs.org/) for the React framework
- [Material UI](https://mui.com/) for the component library
- [Almaz VPN](https://t.me/almazvpnbot) for the VPN service
