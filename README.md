# CarBazaar | Used Car Advertisement Management System

## Overview

The Advertisement Management System is a web application that allows users to manage advertisements. It includes functionalities for creating, viewing, and deleting advertisements. Additionally, users can like advertisements, add them to their cart, and view details about each advertisement. Admin users have additional privileges, such as the ability to delete any advertisement.

## Features

- User Authentication
  - Sign Up
  - Login
  - Logout
  - JWT-based authentication
- Advertisement Management
  - Create new advertisements
  - View advertisement details
  - Add images
  - Delete advertisements
- User Interactions
  - Like advertisements
  - Add advertisements to the cart
  - Buy the car
  - Place an offer 
- Admin Features
  - Admin users can delete any advertisement
- Messaging System
  - Send messages to other users
- Settings Features
  - Changing the username
  - Changing the password
 
## Used Technologies

### Frontend

- **JavaScript**: Programming language that enables interactive web pages.
- **EJS**: Embedded JavaScript templating language for generating HTML markup with plain JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

### Backend

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MySQL**: Relational database management system for storing and managing data.
- **JWT (JSON Web Tokens)**: Standard for creating access tokens for authentication.

  
## Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/kosa12/CarBazaar.git
   cd CarBazaar

2. **Installing prerequisites**
    - Make sure to have `Node.js`, `npm` and `MySQL` installed

3. **Install dependencies**
   ```sh
   npm install

4. **Initialize the Database**
   ```sh
   mysql -u root -p <db/setup.sql

5. **Run the Application**
   ```sh
   npm start

6. **The application should now be running on http://localhost:5000.**


## Acknowledgements
  - This project was made for my web development class
  - Special thanks to my univeristy teachers for their support and guidance throughout the development of this project.


## License
- This project is licensed under the MIT License. See the LICENSE file for details.
   
