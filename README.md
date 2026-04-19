<<<<<<< HEAD
# SkillSwap - Corporate Knowledge Exchange Portal

## Project Overview

SkillSwap is a Spring Boot-based web application designed to foster corporate learning through peer-to-peer mentorship. The system enables employees to exchange skills, connect with mentors, and track their professional development.

## Architecture

The application follows the **MVC (Model-View-Controller)** architecture pattern:

- **Model**: Entity classes and service layer handling business logic
- **View**: Thymeleaf templates for server-side rendering
- **Controller**: Request handlers for routing and request processing

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Security**: Spring Security with BCrypt password encoding
- **Template Engine**: Thymeleaf
- **Build Tool**: Maven 3.8+
- **Java Version**: 17+

## Project Structure

```
skillswap/
├── src/main/
│   ├── java/com/skillswap/
│   │   ├── SkillswapApplication.java          # Main entry point
│   │   ├── config/
│   │   │   └── SecurityConfig.java            # Security configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java            # Authentication endpoints
│   │   │   ├── DashboardController.java       # Dashboard routes
│   │   │   ├── SkillController.java           # Skill management
│   │   │   ├── RequestController.java         # Request handling
│   │   │   ├── SessionController.java         # Session management
│   │   │   ├── FeedbackController.java        # Feedback handling
│   │   │   └── AdminController.java           # Admin panel
│   │   ├── entity/
│   │   │   ├── User.java                      # User model
│   │   │   ├── Skill.java                     # Skill model
│   │   │   ├── SkillTaxonomy.java            # Taxonomy structure
│   │   │   ├── Request.java                   # Mentorship requests
│   │   │   ├── Session.java                   # Learning sessions
│   │   │   ├── Feedback.java                  # Session feedback
│   │   │   └── Notification.java              # User notifications
│   │   ├── repository/
│   │   │   ├── UserRepository.java            # User data access
│   │   │   ├── SkillRepository.java           # Skill data access
│   │   │   ├── RequestRepository.java         # Request data access
│   │   │   ├── SessionRepository.java         # Session data access
│   │   │   ├── FeedbackRepository.java        # Feedback data access
│   │   │   ├── SkillTaxonomyRepository.java   # Taxonomy data access
│   │   │   └── NotificationRepository.java    # Notification data access
│   │   └── service/
│   │       ├── UserService.java               # User business logic
│   │       ├── SkillService.java              # Skill business logic
│   │       ├── RequestService.java            # Request management
│   │       ├── SessionService.java            # Session management
│   │       ├── FeedbackService.java           # Feedback management
│   │       ├── NotificationService.java       # Notification handling
│   │       └── SkillTaxonomyService.java      # Taxonomy management
│   └── resources/
│       ├── application.properties             # Spring Boot config
│       └── templates/
│           ├── index.html                     # Home page
│           ├── dashboard.html                 # Main dashboard
│           ├── auth/
│           │   ├── login.html                 # Login page
│           │   └── register.html              # Registration page
│           ├── skills/
│           │   ├── catalog.html               # Skill catalog
│           │   └── detail.html                # Skill details
│           ├── requests/
│           │   ├── my-requests.html           # Request management
│           │   ├── pending.html               # Pending requests
│           │   ├── detail.html                # Request details
│           │   └── create.html                # Create new request
│           ├── sessions/
│           │   ├── my-sessions.html           # Session list
│           │   └── detail.html                # Session details
│           ├── feedback/
│           │   ├── create.html                # Feedback form
│           │   └── received.html              # Received feedback
│           ├── dashboard/
│           │   ├── admin-dashboard.html       # Admin dashboard
│           │   ├── mentee-dashboard.html      # Mentee dashboard
│           │   ├── mentor-dashboard.html      # Mentor dashboard
│           │   └── hod-dashboard.html         # HOD dashboard
│           └── admin/
│               ├── dashboard.html             # Admin panel
│               ├── taxonomy.html              # Manage taxonomy
│               ├── skills.html                # Manage skills
├── pom.xml                                     # Maven configuration
└── README.md                                   # Project documentation
```

## Feature Overview

### User Roles

1. **Mentee**: Search for skills and request mentorship sessions
2. **Mentor**: List expertise and manage mentorship requests
3. **Head of Department (HOD)**: Monitor team skill development
4. **Administrator**: Manage skill taxonomy and platform configuration

### Core Features

- **Skill Catalog**: Browse available skills with filters (category, proficiency level)
- **Request Management**: Request mentorship with status tracking (Proposed → Accepted → Completed)
- **Session Scheduling**: Schedule, reschedule, or cancel mentorship sessions
- **Feedback System**: Post-session feedback and ratings
- **Skill Taxonomy**: Centralized management of available skills
- **Notifications**: Real-time updates for requests and sessions
- **Analytics**: Track skill growth and development progress

## Prerequisites

- Java Development Kit (JDK) 17 or higher
- Maven 3.8 or higher
- MySQL Server 8.0 or higher
- Git

## Setup Instructions

### 1. Create Database

```sql
CREATE DATABASE skillswap_db;
USE skillswap_db;
```

### 2. Clone and Configure Project

```bash
cd c:\Users\hegde\OneDrive\Documents\ooad_mini
```

### 3. Update Database Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillswap_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Build Project

```bash
mvn clean install
```

### 5. Run Application

```bash
mvn spring-boot:run
```

The application will start at `http://localhost:8080`

## API Endpoints & Routes

### Authentication
- `GET /` - Home page
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Create new user
- `GET /auth/logout` - Logout

### Dashboard
- `GET /dashboard` - Main dashboard
- `GET /dashboard/mentee` - Mentee dashboard
- `GET /dashboard/mentor` - Mentor dashboard
- `GET /dashboard/hod` - HOD dashboard
- `GET /dashboard/admin` - Admin dashboard

### Skills
- `GET /skills/catalog` - View skill catalog
- `GET /skills/{skillId}` - View skill details

### Requests
- `GET /requests/my-requests` - View user's requests
- `GET /requests/pending` - View pending requests (for mentors)
- `GET /requests/{requestId}` - View request details
- `POST /requests/{requestId}/accept` - Accept request
- `POST /requests/{requestId}/decline` - Decline request
- `GET /requests/new` - Create new request page

### Sessions
- `GET /sessions/my-sessions` - View user's sessions
- `GET /sessions/{sessionId}` - View session details
- `POST /sessions/{sessionId}/complete` - Complete session
- `POST /sessions/{sessionId}/reschedule` - Reschedule session
- `POST /sessions/{sessionId}/cancel` - Cancel session

### Feedback
- `GET /feedback/{sessionId}` - Feedback form
- `POST /feedback/submit` - Submit feedback
- `GET /feedback/received` - View received feedback

### Admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/taxonomy` - Manage taxonomy
- `POST /admin/taxonomy` - Create taxonomy
- `GET /admin/skills` - Manage skills
- `POST /admin/skills` - Create skill
- `POST /admin/skills/{skillId}/deactivate` - Deactivate skill

## User Roles & Permissions

| Feature | Mentee | Mentor | HOD | Admin |
|---------|--------|--------|-----|-------|
| View Skills | ✓ | ✓ | ✓ | ✓ |
| Create Requests | ✓ | ✗ | ✗ | ✗ |
| Manage Requests | ✓ | ✓ | ✗ | ✗ |
| Schedule Sessions | ✓ | ✓ | ✗ | ✗ |
| Give Feedback | ✓ | ✓ | ✗ | ✗ |
| View Team Analytics | ✗ | ✗ | ✓ | ✗ |
| Manage Taxonomy | ✗ | ✗ | ✗ | ✓ |
| Manage Skills | ✗ | ✗ | ✗ | ✓ |

## Default Test Credentials

After registration, you can log in with your registered credentials.

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **skills** - Available skills
- **skill_taxonomy** - Skill categories and taxonomy
- **requests** - Mentorship requests
- **sessions** - Scheduled sessions
- **feedback** - Session feedback and ratings
- **notifications** - User notifications
- **user_skills** - User-skill associations

## Common Troubleshooting

### Issue: Cannot connect to database
- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check database name matches configuration

### Issue: Port 8080 already in use
- Change port in `application.properties`: `server.port=8081`
- Or kill the process using port 8080

### Issue: Maven dependencies not downloading
- Clear cache: `mvn clean`
- Update dependencies: `mvn dependency:resolve`

## Development Guidelines

### Adding New Features

1. Create entity class in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create controller in `controller/` package
5. Add corresponding templates in `resources/templates/`

### Code Conventions

- Use meaningful variable and method names
- Add `@Autowired` for dependency injection
- Use `@Transactional` for database operations where needed
- Keep controllers thin - move business logic to services

## Testing

To run tests:
```bash
mvn test
```

## Deployment

### Production Build
```bash
mvn clean package -DskipTests
```

This creates a JAR file in `target/` directory.

### Running JAR
```bash
java -jar target/skillswap-1.0.0.jar
```

## Future Enhancements

- [ ] Video conferencing integration for sessions
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Mobile app support
- [ ] Integration with corporate directory
- [ ] Skill recommendation engine
- [ ] Batch session scheduling

## Support & Documentation

For detailed information, refer to:
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Thymeleaf](https://www.thymeleaf.org/)

## License

This project is created for educational purposes.

---

**Last Updated**: March 2024
**Version**: 1.0.0
=======
# skillswap2
>>>>>>> 1c30149d9d5eaaec4f7db490a197dd1abe46a41b
