GitHub Link : https://github.com/DeeptiKoranga/ResearchNestHackathon

# ResearchNest: Hierarchical Academic Progress Tracker
A full-stack MERN application developed as a 48-hour prototype. ResearchNest provides an interactive, hierarchical progress tracker for students and a monitoring dashboard for faculty, built with a focus on robust data modeling, clean architecture, and complex state management.

## Key Features
1. Role-Based Dashboards: Separate, secure views for Students and Faculty.
2. Hierarchical Progress View: A multi-level tree structure (Milestones > Stages > Tasks > Subtasks) provides a granular view of academic progress.
3. Smart Cascading Logic (Upward): Completing all child items automatically updates the parent item's status to "Completed". The logic also handles "In Progress" and "Locked" states.
4. Faculty Override Powers (Downward): Faculty can override the status of any item. Setting a parent to "Completed" or "Locked" automatically cascades that status down to all of its children and grandchildren.
5. Data Integrity Engine: Includes advanced edge-case handling. If a faculty member reverts a "Completed" parent to "In Progress," the system automatically reverts the last completed child to maintain a logically consistent state.
6. Secure Authentication: JWT-based authentication ensures that all API endpoints are protected and accessible only by the appropriate roles.

## Tech Stack
* Frontend: React, React Router, Context API, Material-UI (MUI)
* Backend: Node.js, Express.js
* Database: MongoDB with Mongoose
* Authentication: JSON Web Tokens (JWT), bcrypt

## Getting Started: Setup & Installation
Follow these steps to get the project running on your local machine.

### Prerequisites
* Node.js (v16 or later)
* MongoDB Community Server

### Seeding the Database (Required First Step)
To use the application, you must first populate it with sample data. A seed script is provided to create user accounts and assign a full task hierarchy to each student. ./server --> node seed.js

1. Clone the Repository
2. Navigate to the server directory. Install dependencies: npm install
    Create a .env file in the /server directory and add the following variables:
    PORT=7000
    MONGO_URI=mongodb://127.0.0.1:27017/researchnest
    JWT_SECRET=a_very_secret_key_for_the_hackathon
3. Navigate to the client directory from the project root. Install dependencies: npm install
        Create a .env file in the /client directory and add the following:
        REACT_APP_API_URL=http://localhost:7000/api
4. Run the Application

### Start the Backend Server: In the /server directory: npm run dev
The server will be running on http://localhost:7000.

### Start the Frontend Application: In the /client directory: npm start
The React app will open on http://localhost:3000.

## User Credentials for Login
The seed script creates the following user accounts. You can use these to log in and test the application.
Password for all users: password123

Role	Email
Student	alice.johnson@example.com
Student	bob.williams@example.com
Student	charlie.brown@example.com
Faculty	prof.davis@example.com

## Challenges Addressed
* Hierarchical Data Modeling: The "Array of Ancestors" pattern in MongoDB was chosen for its exceptional performance in querying all descendants of a node, which is crucial for the faculty's downward cascading override feature.
* Complex State Management: The core business logic is that a parent's status is derived from its children's statuses. This was solved by implementing two distinct but complementary logic systems:
* Upward Cascade (Model Logic): After any item is saved, Mongoose post('save') hook on the ProgressItem model runs, it checks the status of its siblings, and automatically updates the parent's status. This ensures the data is always consistent from the bottom up.
* Downward Cascade (Controller Logic): A specific overrideItemStatus function in the progressController handles the faculty's special permissions. When triggered, it performs a bulk update on all descendants before saving the parent, ensuring the change is pushed from the top down.

## Assumptions Made
* Task Assignment Workflow: The prototype assumes task hierarchies are assigned by faculty. The mechanism for creating these "templates" is considered a future feature. The seed script simulates this assignment process.

### Solution Diagram
-----------------      ---------------------------      -----------------------------        -------------------
|      Users     |      |    Frontend (Browser)    |      |     Backend (Server)      |      |    Database     |
| (Student/      | ====>|       React App          |==>   |   Node.js & Express API   |=====>|     MongoDB     |
|    Faculty)    |      | (MUI Components, Context)|      | (REST API Endpoints)      |      | (Progress Items,|
------------------      |                          |      |                           |      |      Users)     |
                        | - Renders Dashboards     |      | - verifyToken() Middleware|      |                 |
                        | - Handles User Input     |      | - authorize() Middleware  |      |                 |
                        | - Makes API Calls (Axios)|      |                           |      |                 |
                         ---------------------------    | |---------------------------|      -------------------
                                  ^                     | |  Parent/child logic       |            ^
                                  |                     | | (Cascade Engine)          |            |
                                  |                     |  ----------------------------            |           
                                  |                     |             |                            |
                                  -----------------------             v             ----------------
                                     (JSON/API Response)        (Mongoose Queries)

## Dependencies List
### Server (package.json)
* bcryptjs: For hashing passwords.
* cors: To enable cross-origin requests.
* dotenv: For managing environment variables.
* express: The web server framework.
* jsonwebtoken: For creating and verifying authentication tokens.
* mongoose: The Object Data Modeler (ODM) for MongoDB.
* nodemon: (Dev dependency) for automatic server restarts.

### Client (package.json)
* axios: For making HTTP requests to the backend API.
* react, react-dom, react-scripts: Core React libraries.
* react-router-dom: For client-side routing.
* @mui/material, @mui/icons-material, @mui/x-tree-view: The UI component library for building the interface.
* @emotion/react, @emotion/styled: Styling engines required by MUI.
