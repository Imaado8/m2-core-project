# ModernTech Solutions
- - - -
ModernTech Solutions is a fully functional HR management web application that automates HR functions like managing their employees information , attendance, payroll ,leave request as well as performance reviews.
- - - -
## Table of Contents
 - [Live Demo](#live-demo)
 - [Techonologies Used](#technologies-used)
 - [Setup Instructions](#setup-instructions)
 - [Key Features](#key-features)
 - [Login Credentials](#login-credentials)
 - [Contributing](#contributing)
- - - -
## Live Demo
[Link to the live deployed website]()
- - - -
## Technologies Used
    * Frontend: Vue 3 , Tailwind CSS, Bootstrap, Axios
    * Backend: Node.js ,Express.js
    * Database: MySQL
    * Dependencies:
    * jsonwebtoken
    * bcryptjs
    * express
    * dotenv
    * cors
    * mysql2
- - - -
### Prerequisites
Requirements for the software and other tools to build, test and push
- Node.js
- MySQL installed
- VS code
- - - -
### Set up Instructions
Follow these steps to get the HR backend running locally:
1. **Clone the Repository**
```bash
    git clone [https://github.com/Imaado8/Finalproject2.git]
   ```
3. **Install dependencies**
   Navigate to backend then install dependencies
```bash
    cd backend
    npm install mysql2 bcryptjs cors express dotenv jsonwebtoken
```
4. **Database setup**
  Create a  .env file , change the password to your MySQL password
```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_db_password
    DB_NAME=moderntech_db
    JWT_SECRET=your_random_jwt_secret_key
    PORT=3000
```
5. **Run the backend server**
```bash
    node server.js
```
This server will run on http://localhost:3000
6. **Run frontend**
On the terminal ,navigate to the frontend folder and install dependencies
```bash
cd frontend
npm install
```
7. **Start frontend server:**
```bash
npm run serve
```
8. It will generate links, click the local link to see the website.
```bash
 App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.3.150:8080/
```
- - - -
## Key Features
    * Login page with password
    * Employee management -ability to manage, add, update,delete employee information
    * Attendance Tracking
    * Leave Requests
    * Payroll Management with generated payslips
    * Performance review
- - - -
### Login Credentials
Enter the below email and password for access.
```bash
    email: admin@gmail.com
    Password: admin123
```
  - - - -
## Contributing
This project is a collaborative effort by group 18:
- *Zaaidah Abrahams*
- *Imaad Peters*
- *Okuhle Sotyanya*
- *Zayyaan Salie*
- - - -