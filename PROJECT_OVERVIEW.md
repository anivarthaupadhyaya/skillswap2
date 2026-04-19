# SkillSwap Project - Complete Overview

## Quick Start Summary

SkillSwap is a **Spring Boot MVC web application** that enables corporate employees to share and learn skills through peer-to-peer mentorship.

**Status**: Project structure complete and ready for development

**Tech Stack**: Spring Boot 3.2 + MySQL + Thymeleaf + Spring Security

## What's Included

### ✅ Project Infrastructure
- [x] Maven POM configuration with all dependencies
- [x] Spring Boot application entry point
- [x] Security configuration with role-based access
- [x] Database configuration (application.properties)
- [x] Logging setup

### ✅ Entity Models (Database Layer)
- [x] User (with role inheritance)
- [x] Skill
- [x] SkillTaxonomy
- [x] Request
- [x] Session
- [x] Feedback
- [x] Notification

### ✅ Repository Layer (Data Access)
- [x] UserRepository
- [x] SkillRepository
- [x] RequestRepository
- [x] SessionRepository
- [x] FeedbackRepository
- [x] NotificationRepository
- [x] SkillTaxonomyRepository

### ✅ Service Layer (Business Logic)
- [x] UserService
- [x] SkillService
- [x] RequestService
- [x] SessionService
- [x] FeedbackService
- [x] NotificationService
- [x] SkillTaxonomyService

### ✅ Controller Layer (Web Handlers)
- [x] HomeController
- [x] AuthController (Login/Register)
- [x] DashboardController
- [x] SkillController
- [x] RequestController
- [x] SessionController
- [x] FeedbackController
- [x] AdminController

### ✅ View Layer (Templates)
- [x] index.html (Home)
- [x] auth/login.html
- [x] auth/register.html
- [x] dashboard.html
- [x] skills/catalog.html
- [x] requests/my-requests.html
- [x] sessions/my-sessions.html
- [x] feedback/received.html

### ✅ Documentation
- [x] README.md (Project overview)
- [x] SETUP_GUIDE.md (Installation & configuration)
- [x] DEVELOPMENT_GUIDE.md (Architecture & patterns)
- [x] USE_CASES.md (Team assignments)
- [x] .gitignore (Version control)

## Documentation Guide

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Project overview & features | Everyone |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Installation & running locally | Developers |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | Architecture & extending | Developers |
| [USE_CASES.md](USE_CASES.md) | Team assignments & integration | Project Lead |

## Getting Started (5 Minutes)

### 1. Prerequisites
- Java 17+
- Maven
- MySQL Server

### 2. Create Database
```sql
CREATE DATABASE skillswap_db;
```

### 3. Configure Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=your_mysql_password
```

### 4. Run Application
```bash
mvn spring-boot:run
```

### 5. Access Application
Visit: `http://localhost:8080`

**Login with any test account created during registration**

## Project Structure

```
skillswap/
├── src/main/
│   ├── java/com/skillswap/
│   │   ├── SkillswapApplication.java
│   │   ├── config/               # Security & Spring config
│   │   ├── controller/           # Web request handlers (7 controllers)
│   │   ├── entity/               # JPA entity models (7 entities)
│   │   ├── repository/           # Data access interfaces (7 repos)
│   │   └── service/              # Business logic (7 services)
│   └── resources/
│       ├── application.properties # App configuration
│       └── templates/             # Thymeleaf HTML templates
│           ├── index.html
│           ├── auth/              (2 templates)
│           ├── dashboard/
│           ├── skills/            (2 templates)
│           ├── requests/          (4 templates)
│           ├── sessions/          (2 templates)
│           ├── feedback/          (2 templates)
│           └── admin/             (4 templates)
├── pom.xml                        # Maven dependencies
├── README.md                      # Project overview
├── SETUP_GUIDE.md                 # Installation guide
├── DEVELOPMENT_GUIDE.md           # Architecture guide
├── USE_CASES.md                   # Team assignments
└── .gitignore                     # Git ignore rules
```

## Key Features by User Role

### 👨‍🎓 Mentee
- Browse skill catalog
- Search for mentors
- Create mentorship requests
- Schedule sessions
- Submit feedback
- View ratings received
- Track learning progress

### 👨‍🏫 Mentor
- List expertise
- Manage incoming requests
- Accept/decline requests
- Schedule sessions
- Conduct mentorship
- Receive feedback
- View mentee ratings

### 👔 Head of Department (HOD)
- View team skill inventory
- Monitor skill development
- Access analytics dashboard
- Identify skill gaps
- Generate reports
- Track team progress

### 🔐 Administrator
- Manage skill taxonomy
- Add/edit/delete skills
- Manage user accounts
- Configure system settings
- View platform analytics
- Manage user roles

## Database Design

### 7 Core Entities
1. **User** - Employee profiles with roles
2. **Skill** - Technical and soft skills
3. **SkillTaxonomy** - Skill categories
4. **Request** - Mentorship requests
5. **Session** - Scheduled sessions
6. **Feedback** - Post-session reviews
7. **Notification** - User notifications

### Entity Relationships
- Users can have multiple Skills (Many-to-Many)
- Users create Requests (One-to-Many, as mentee/mentor)
- Requests generate Sessions (One-to-One)
- Sessions receive Feedback (One-to-One)
- Users get Notifications (One-to-Many)

## Key Workflows

### Request Workflow
```
Mentee browses catalog
    ↓
Selects skill & mentor
    ↓
Creates request → Request.status = PROPOSED
    ↓
Mentor notified → Notification created
    ↓
Mentor reviews
    ├─ Accepts → Request.status = ACCEPTED → Session created
    ├─ Declines → Request.status = DECLINED
    └─ Reschedules → Request.status = RESCHEDULED
    ↓
(If accepted) Session scheduled
    ↓
Session occurs
    ↓
Both submit feedback & ratings
```

### Session Lifecycle
```
SCHEDULED → IN_PROGRESS → COMPLETED (→ Feedback)
         ├→ CANCELLED
         └→ RESCHEDULED
```

## Technology Stack Details

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Web Server** | Spring Boot | Application runtime |
| **Framework** | Spring MVC | Request handling & routing |
| **Security** | Spring Security | Authentication & authorization |
| **Data Access** | Spring Data JPA | Object-relational mapping |
| **Database** | MySQL 8.0 | Data persistence |
| **View** | Thymeleaf | Server-side HTML template |
| **Password** | BCrypt | Secure password hashing |
| **Build** | Maven | Dependency management |

## 6 Use Cases (Distributed Work)

Each use case is a complete, independent feature that integrates with others:

1. **Authentication & User Management** - Login, registration, profiles
2. **Skill Catalog** - Browse, search, manage available skills
3. **Request Management** - Create, approve, track mentorship requests
4. **Session Scheduling** - Schedule, manage, track sessions
5. **Feedback System** - Collect ratings and reviews
6. **Analytics & Reporting** - HOD dashboards and analytics

See [USE_CASES.md](USE_CASES.md) for detailed team assignments.

## Security Features

- ✅ BCrypt password encryption
- ✅ Role-based access control (RBAC)
- ✅ Session management via Spring Security
- ✅ CSRF protection
- ✅ SQL injection prevention (JPA parameterized)
- ✅ XSS protection (Thymeleaf escaped)
- ✅ Secure password storage

## Development Quick Reference

### Common Commands
```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Skip tests
mvn clean install -DskipTests

# Package as JAR
mvn clean package

# View dependencies
mvn dependency:tree
```

### Adding New Feature
1. Create Entity in `entity/` package
2. Create Repository in `repository/` package
3. Create Service in `service/` package
4. Create Controller in `controller/` package
5. Create Templates in `templates/` subdirectory

### Common Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Home page |
| `/auth/login` | GET/POST | User login |
| `/auth/register` | GET/POST | User registration |
| `/dashboard` | GET | User dashboard |
| `/skills/catalog` | GET | Skill catalog |
| `/requests/my-requests` | GET | View requests |
| `/sessions/my-sessions` | GET | View sessions |
| `/feedback/received` | GET | View feedback |

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Change in application.properties: `server.port=8081` |
| Database connection failed | Check MySQL running, verify credentials |
| Templates not found | Ensure files in `src/main/resources/templates/` |
| Build failures | Run `mvn clean` then `mvn install` |
| Dependency errors | Run `mvn dependency:resolve` |

## Next Steps

### For Development
1. Clone the repository
2. Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Read [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
4. Review [USE_CASES.md](USE_CASES.md) for your assignment

### For Testing
1. Register test users with different roles
2. Create sample skills (as admin)
3. Test complete workflows
4. Verify database operations

### For Deployment
1. Create production JAR: `mvn clean package`
2. Run JAR: `java -jar target/skillswap-1.0.0.jar`
3. Configure production database
4. Set environment variables

## Important Files & Locations

| File | Location |
|------|----------|
| Main Entry Point | `src/main/java/com/skillswap/SkillswapApplication.java` |
| Security Config | `src/main/java/com/skillswap/config/SecurityConfig.java` |
| Database Config | `src/main/resources/application.properties` |
| Templates Root | `src/main/resources/templates/` |
| Maven Config | `pom.xml` |

## Support & Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Thymeleaf**: https://www.thymeleaf.org
- **MySQL**: https://dev.mysql.com/doc/
- **Maven**: https://maven.apache.org

## Version Information

- **Project Version**: 1.0.0
- **Spring Boot**: 3.2.0
- **Java**: 17+
- **MySQL**: 8.0+
- **Maven**: 3.8+

## Project Statistics

- **Total Classes**: 20+
- **Total Repositories**: 7
- **Total Services**: 7
- **Total Controllers**: 8
- **Total Templates**: 15+
- **Database Tables**: 7
- **Lines of Code**: ~1500+

## License

Educational project for learning OOAD and Spring Boot.

---

**Last Updated:** March 2024
**Created For:** OOAD Mini Project - SkillSwap Platform
**Status**: ✅ Ready for Development
