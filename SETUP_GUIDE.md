# SkillSwap Project Setup & Development Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Building & Running](#building--running)
5. [Database Setup](#database-setup)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Development Workflow](#development-workflow)

## Project Overview

SkillSwap is a corporate knowledge exchange portal built with Spring Boot that enables employees to learn and share skills through peer-to-peer mentorship.

**Key Technologies:**
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8.0
- Thymeleaf
- Maven

## Prerequisites

Before starting, ensure you have:

1. **Java Development Kit (JDK) 17 or higher**
   ```bash
   java -version
   ```

2. **Maven 3.8 or higher**
   ```bash
   mvn -version
   ```

3. **MySQL Server 8.0 or higher**
   - For Windows: Download from [mysql.com](https://www.mysql.com/downloads/mysql/)
   - Ensure MySQL service is running

4. **Git** (for version control)
   ```bash
   git --version
   ```

## Initial Setup

### Step 1: Clone/Extract Project

Navigate to your workspace directory:
```bash
cd c:\Users\hegde\OneDrive\Documents\ooad_mini
```

### Step 2: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE skillswap_db;
USE skillswap_db;
```

### Step 3: Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillswap_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password.

### Step 4: Verify Project Structure

Ensure your project has:
- `pom.xml` in root directory
- `src/main/java/` with controller, entity, repository, service packages
- `src/main/resources/` with `application.properties` and `templates/`
- `README.md` documentation

## Building & Running

### Option 1: Using Maven Commands

1. **Clean and Build:**
   ```bash
   mvn clean install
   ```

2. **Run Application:**
   ```bash
   mvn spring-boot:run
   ```

3. **Access Application:**
   - Open browser and go to: `http://localhost:8080`

### Option 2: Using IDE (IntelliJ IDEA or VS Code)

**For IntelliJ IDEA:**
1. File → Open → Select project directory
2. Right-click `SkillswapApplication.java` → Run
3. Application will start automatically

**For VS Code:**
1. Install Extension Pack for Java
2. Open project in VS Code
3. Click Run button next to `main()` method in `SkillswapApplication.java`

### Option 3: Running JAR Package

1. **Create JAR:**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Run JAR:**
   ```bash
   java -jar target/skillswap-1.0.0.jar
   ```

## Database Setup

### Automatic Schema Generation

The application uses Hibernate's `ddl-auto=update` setting, which automatically creates tables on first run.

### Manual Schema Creation (Optional)

If you need to manually create tables, here's the SQL:

```sql
-- Users table
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    proficiency_level INT,
    is_active BOOLEAN DEFAULT TRUE,
    taxonomy_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Requests table
CREATE TABLE requests (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentee_id BIGINT,
    mentor_id BIGINT,
    skill_to_learn_id BIGINT,
    skill_to_teach_id BIGINT,
    status VARCHAR(50),
    message TEXT,
    requested_at TIMESTAMP,
    responded_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (mentee_id) REFERENCES users(user_id),
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
);

-- Sessions table
CREATE TABLE sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT UNIQUE,
    mentee_id BIGINT,
    mentor_id BIGINT,
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status VARCHAR(50),
    notes TEXT,
    session_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentee_id) REFERENCES users(user_id),
    FOREIGN KEY (mentor_id) REFERENCES users(user_id)
);
```

## Testing the Application

### Create Test Users

1. Navigate to: `http://localhost:8080/auth/register`
2. Create test accounts with different roles:

**Test User 1 (Mentee):**
- Email: mentee@example.com
- Password: test123
- Role: MENTEE
- Department: Engineering

**Test User 2 (Mentor):**
- Email: mentor@example.com
- Password: test123
- Role: MENTOR
- Department: Engineering

**Test User 3 (Admin):**
- Email: admin@example.com
- Password: test123
- Role: ADMIN
- Department: Administration

### Test Main Features

1. **Login:**
   - Visit `http://localhost:8080/auth/login`
   - Enter credentials

2. **Skill Catalog:**
   - After login, click "Skill Catalog"
   - Should display available skills (initially empty)

3. **Create Skills (Admin):**
   - Login as admin
   - Go to `http://localhost:8080/admin/skills`
   - Add sample skills

4. **Request Skills (Mentee):**
   - Login as mentee
   - Browse skills and create requests

## Troubleshooting

### Issue: Port 8080 Already in Use

**Solution:**
Change port in `application.properties`:
```properties
server.port=8081
```

Or kill the process using port 8080:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Issue: Cannot Connect to Database

**Solution:**
1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```

2. Check credentials in `application.properties`

3. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```

### Issue: Maven Dependency Issues

**Solution:**
```bash
mvn clean
mvn dependency:resolve
mvn install
```

### Issue: Thymeleaf Templates Not Found

**Solution:**
- Ensure templates are in `src/main/resources/templates/`
- Check template file names match controller mappings
- Verify Thymeleaf dependency in pom.xml

### Issue: Application Starts But Pages Show 404

**Solution:**
1. Check controller route mappings
2. Verify template files exist
3. Check for typos in URLs
4. View application logs for errors:
   ```bash
   mvn spring-boot:run -X
   ```

## Development Workflow

### Adding a New Feature

1. **Create Entity:**
   ```java
   @Entity
   @Table(name = "new_entity")
   public class NewEntity {
       // fields and methods
   }
   ```

2. **Create Repository:**
   ```java
   @Repository
   public interface NewEntityRepository extends JpaRepository<NewEntity, Long> {
   }
   ```

3. **Create Service:**
   ```java
   @Service
   public class NewEntityService {
       @Autowired
       private NewEntityRepository repository;
       // business logic
   }
   ```

4. **Create Controller:**
   ```java
   @Controller
   @RequestMapping("/new-entity")
   public class NewEntityController {
       @Autowired
       private NewEntityService service;
       // endpoints
   }
   ```

5. **Create Template:**
   Create `.html` file in `src/main/resources/templates/new-entity/`

### Code Quality Guidelines

- Use meaningful variable names
- Add comments for complex logic
- Keep methods focused and small
- Use `@Transactional` for database operations
- Handle exceptions appropriately

### Testing Best Practices

1. Test each role scenario (Mentee, Mentor, Admin, HOD)
2. Verify database operations work correctly
3. Test edge cases and error conditions
4. Validate form inputs

## Common Commands

```bash
# Build project
mvn clean build

# Run tests
mvn test

# Skip tests during build
mvn clean install -DskipTests

# Run application
mvn spring-boot:run

# Package as JAR
mvn clean package

# View maven dependencies
mvn dependency:tree

# Clean build artifacts
mvn clean

# Update dependencies
mvn -U install
```

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Thymeleaf Tutorial](https://www.thymeleaf.org/doc/tutorials/3.0/classicalmvc.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Check the README.md file
4. Consult Spring Boot documentation

---

**Last Updated:** March 2024
**Version:** 1.0.0
