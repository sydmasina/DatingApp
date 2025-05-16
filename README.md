
# DatingApp

A full-stack dating application built with ASP.NET Core and Angular. This project serves as a practical exercise in implementing a RESTful API with an Angular frontend client. It is currently a work in progress (WIP).

## Features

- **User Authentication**: Secure user registration and login functionalities.
- **Profile Management**: Users can create and manage their profiles.
- **Photo Uploads**: Integration with Cloudinary for storing and managing user photos.
- **Messaging System**: Real-time messaging between users.
- **Like Functionality**: Users can like other profiles.
- **Responsive Design**: Mobile-friendly interface using Bootstrap.

## Technologies Used

### Backend

- **ASP.NET Core**: Web API development.
- **Entity Framework Core**: Object-relational mapping (ORM).
- **AutoMapper**: Object-object mapping.
- **JWT Authentication**: Secure user authentication.

### Frontend

- **Angular**: Frontend framework.
- **RxJS**: Reactive programming.
- **Bootstrap**: Responsive design.

## Getting Started

### Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/sydmasina/DatingApp.git
   cd DatingApp
   ```

2. **Set up the Backend**:

   - Navigate to the `API` directory:

     ```bash
     cd API
     ```

   - Update the `appsettings.json` file with your database connection string and Cloudinary credentials.

   - Apply migrations and update the database:

     ```bash
     dotnet ef database update
     ```

   - Run the API:

     ```bash
     dotnet run
     ```

3. **Set up the Frontend**:

   - Navigate to the `client` directory:

     ```bash
     cd ../client
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Run the Angular application:

     ```bash
     ng serve
     ```

   - Open your browser and navigate to `http://localhost:4200`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Note: This README is based on the current state of the repository and may need updates as the project evolves.*
