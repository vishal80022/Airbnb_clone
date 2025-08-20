
# Wanderlust: A Full-Stack Airbnb Clone

Wanderlust is a feature-rich, full-stack web application inspired by Airbnb. It allows users to discover, list, and review unique places to stay around the world. The project is built with a classic MVC (Model-View-Controller) architecture and demonstrates a wide range of web development skills, from backend routing and database management to frontend design and user authentication.

## Key Features

  * **User Authentication**: Secure user registration and login functionality using Passport.js, allowing users to create and manage their accounts.
  * **Property Listings**: Users can perform CRUD (Create, Read, Update, Delete) operations for property listings. Unauthenticated users can view all listings, but only logged-in users can create, edit, or delete them.
  * **Reviews and Ratings**: Authenticated users can leave reviews and ratings on property listings, which are then displayed on the listing's page.
  * **Interactive UI**: A clean and responsive user interface built with Bootstrap and EJS, ensuring a seamless experience across different devices.
  * **Data Validation**: Robust server-side data validation using Joi to ensure the integrity of user and listing data before it is saved to the database.
  * **Error Handling**: A centralized error-handling middleware to gracefully manage and report errors throughout the application.

## Tech Stack

### Backend

  * **Node.js**: A JavaScript runtime for building the server-side logic.
  * **Express**: A web application framework for Node.js, used for routing and middleware.
  * **MongoDB**: A NoSQL database used to store user, listing, and review data.
  * **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
  * **Passport.js**: An authentication middleware for Node.js, used for user login and session management.
  * **EJS (Embedded JavaScript)**: A simple templating language used to generate HTML markup with plain JavaScript.

### Frontend

  * **HTML5 & CSS3**
  * **Bootstrap 5**: A popular CSS framework for building responsive and mobile-first websites.
  * **JavaScript**: For client-side interactivity and form validation.

## Getting Started

To get a local copy of the project up and running, follow these simple steps.

### Prerequisites

  * **Node.js** and **npm** (Node Package Manager) must be installed on your machine.
  * **MongoDB** must be installed and running locally.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd airbnb_clone
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Initialize the database:**
    The project comes with a sample data file to populate the database with initial listings. Run the following command to initialize it:
    ```bash
    node init/index.js
    ```
5.  **Start the server:**
    ```bash
    node app.js
    ```
6.  **Open your browser** and navigate to `http://localhost:8080` to see the application in action.
