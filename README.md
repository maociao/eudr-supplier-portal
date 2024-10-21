# EUDR Supplier Portal

## Overview

The EUDR Supplier Portal is a web application designed to facilitate the submission of geospatial data related to purchase orders. It consists of a React frontend and a Node.js backend, providing a user-friendly interface for suppliers to upload GeoJSON files associated with specific purchase orders.

## Features

- User authentication (registration and login)
- Secure file upload for GeoJSON files
- Purchase order and line item association
- Form data validation
- Responsive design using Material-UI

## Technology Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Authentication: JSON Web Tokens (JWT)
- File Handling: Multer
- API Requests: Axios

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (usually comes with Node.js)
- Git

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/maociao/eudr-supplier-portal.git
   cd eudr-supplier-portal
   ```
"/bin/sh", "-c", 
   npm install
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=8080
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_jwt_secret_here` with a strong, unique secret key.

## Running the Application Locally

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
   The server will start on `http://localhost:8080`.

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in with existing credentials.
3. Once logged in, you can submit purchase order information and upload associated GeoJSON files.
4. Use the "Clear" button to reset the form, and the "Submit" button to send the data to the server.

## Deployment

The application is configured for deployment to Google Cloud Run. Refer to the `deployment-instructions.md` file for detailed steps on how to deploy both the frontend and backend to Google Cloud Run.

## File Structure

```
eudr-supplier-portal/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── EUDRSupplierPortal.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── deployment-instructions.md
└── README.md
```

## Contributing

Contributions to the EUDR Supplier Portal are welcome. Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers directly.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)