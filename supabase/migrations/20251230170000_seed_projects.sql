-- Seed initial projects data
INSERT INTO public.projects
    (title, description, content, category, tags, image_url, demo_url, github_url, featured, display_order)
VALUES
    (
        'AstrodevIoT Platform',
        'Integrated IoT monitoring platform for weather, water/air quality, and power management with Telegram bot integration.',
        'AstrodevIoT is a comprehensive Internet of Things monitoring platform designed to collect, analyze, and visualize data from various environmental sensors. The platform features real-time data streaming via MQTT, integration with Telegram bots for alerts and notifications, and a responsive web dashboard built with React and Supabase.

## Key Features

- **Weather Monitoring**: Real-time temperature, humidity, pressure, and air quality tracking
- **Water Quality Sensors**: pH, turbidity, dissolved oxygen, and conductivity measurements
- **Power Management**: AC/DC power consumption monitoring with energy analytics
- **Telegram Integration**: Instant alerts and bot commands for device control
- **Historical Data**: Time-series data storage and visualization with custom date ranges
- **Multi-Device Support**: Manage multiple sensor nodes from a single dashboard

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Supabase (PostgreSQL + Realtime)
- IoT: ESP32, MQTT, Arduino sensors
- Notifications: Telegram Bot API

The platform is designed for scalability and can handle thousands of simultaneous sensor readings while maintaining sub-second latency.',
        'IoT',
        ARRAY
['React', 'Supabase', 'ESP32', 'MQTT', 'Telegram Bot'],
    NULL,
    'https://iot.astrodev.cloud',
    NULL,
    true,
    1
  ),
(
    'E-Commerce Dashboard',
    'Full-featured admin dashboard for e-commerce with real-time analytics, inventory management, and order tracking.',
    'A modern admin dashboard solution for e-commerce businesses that need to manage their online store efficiently. Built with Next.js and TypeScript, this dashboard provides a comprehensive suite of tools for managing products, orders, customers, and analytics.

## Features

- **Real-time Analytics**: Sales trends, revenue charts, and customer insights
- **Inventory Management**: Product catalog, stock tracking, and automated reorder alerts
- **Order Processing**: Complete order lifecycle management from checkout to delivery
- **Customer Portal**: User accounts, order history, and support tickets
- **Multi-vendor Support**: Separate vendor dashboards and commission tracking

## Technologies

- Next.js 14 with App Router
- TypeScript for type safety
- PostgreSQL database
- Recharts for data visualization
- shadcn/ui components

Perfect for small to medium businesses looking to scale their e-commerce operations.',
    'Web App',
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Recharts'],
    NULL,
    NULL,
    NULL,
    false,
    2
  ),
(
    'Smart Home Controller',
    'Mobile-responsive web app to control smart home devices with voice commands and automation rules.',
    'Transform your home into a smart home with this intuitive web-based controller. Control lights, thermostats, security cameras, and more from a single unified interface. The system supports voice commands via Web Speech API and allows you to create complex automation rules.

## Capabilities

- **Device Control**: Switch, dimmer, RGB lighting, thermostats, and locks
- **Voice Commands**: Natural language processing for hands-free control
- **Automation Rules**: Time-based, sensor-triggered, and conditional automations
- **Scene Management**: Create and activate multi-device scenes with one tap
- **Energy Monitoring**: Track power consumption and optimize usage

## Architecture

- React frontend with responsive design
- Node.js backend with WebSocket for real-time updates
- Arduino/ESP32 devices for hardware integration
- MQTT protocol for device communication

The system is designed to work with popular smart home protocols including Zigbee, Z-Wave, and WiFi devices.',
    'IoT',
    ARRAY['React', 'Node.js', 'WebSocket', 'Arduino'],
    NULL,
    NULL,
    NULL,
    false,
    3
  ),
(
    'Weather Station API',
    'RESTful API for weather data collection and analysis with historical data and predictions.',
    'A robust weather data API designed for developers who need reliable weather information. The API collects data from multiple weather stations, aggregates the information, and provides both current conditions and historical data through a clean RESTful interface.

## API Features

- **Current Weather**: Real-time data with <5 minute updates
- **Historical Data**: Access years of archived weather measurements
- **Forecasting**: Machine learning-based predictions for 7-day outlook
- **Multiple Locations**: Support for thousands of weather stations worldwide
- **Data Formats**: JSON and CSV export options

## Endpoints

```
GET /api/v1/current/{location}
GET /api/v1/history/{location}?start=2024-01-01&end=2024-12-31
GET /api/v1/forecast/{location}?days=7
```

## Tech Stack

- Python with FastAPI framework
- PostgreSQL with TimescaleDB for time-series data
- Docker containers for easy deployment
- Redis caching for improved performance

Includes comprehensive API documentation with Swagger UI.',
    'API',
    ARRAY['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    NULL,
    NULL,
    NULL,
    false,
    4
  );
