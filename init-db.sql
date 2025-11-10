-- Create databases for each service
CREATE DATABASE IF NOT EXISTS restaurants;
CREATE DATABASE IF NOT EXISTS orders;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE restaurants TO fooddelivery;
GRANT ALL PRIVILEGES ON DATABASE orders TO fooddelivery;
