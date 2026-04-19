# SkillSwap - Pre-Development Checklist

## Environment Setup Checklist

### Java Installation
- [ ] Java 17 or higher installed: `java -version`
- [ ] JAVA_HOME environment variable set
- [ ] `javac` command working

### Maven Installation  
- [ ] Maven 3.8+ installed: `mvn -version`
- [ ] MAVEN_HOME environment variable set
- [ ] `.m2` repository configured

### MySQL Installation
- [ ] MySQL Server 8.0+ installed and running
- [ ] MySQL command-line client available: `mysql --version`
- [ ] MySQL service running (check Services on Windows)
- [ ] Default user credentials known
- [ ] Can login: `mysql -u root -p`

### IDE/Editor
- [ ] IntelliJ IDEA / VS Code / Eclipse installed
- [ ] Extension for Java development installed
- [ ] Maven extension/plugin configured
- [ ] Git configured (if using version control)

## Project Setup Checklist

### Database Configuration
- [ ] Created database: `CREATE DATABASE skillswap_db;`
- [ ] Updated `application.properties` with correct credentials
- [ ] Tested connection to database
- [ ] No errors in database configuration

### Project Structure
- [ ] Project extracted/cloned to correct location
- [ ] `pom.xml` exists in root directory
- [ ] `src/main/java/com/skillswap/` directory structure exists
- [ ] `src/main/resources/application.properties` exists
- [ ] `src/main/resources/templates/` directory exists

### Dependencies
- [ ] Run `mvn clean install`
- [ ] All dependencies downloaded successfully
- [ ] No build failure messages
- [ ] `.m2` repository has downloaded files (~300MB)

### Build Verification
- [ ] `mvn clean build` completes without errors
- [ ] No compilation errors
- [ ] No dependency resolution errors
- [ ] Target folder created with compiled code

## Running Application Checklist

### Pre-Runtime
- [ ] MySQL server is running
- [ ] Database `skillswap_db` is accessible
- [ ] Port 8080 is available (not in use)
- [ ] No compilation errors in IDE

### Starting Application
- [ ] Application starts with `mvn spring-boot:run`
- [ ] No "Cannot connect to database" errors
- [ ] No "port already in use" errors
- [ ] No "class not found" errors
- [ ] Console shows "Started SkillswapApplication"

### Accessing Application
- [ ] Browser loads: `http://localhost:8080`
- [ ] Home page displays correctly
- [ ] Login link works
- [ ] Register link works
- [ ] Navigation styling loads properly

## Feature Verification Checklist

### Authentication (Use Case 1)
- [ ] Registration page accessible
- [ ] Can create new user account
- [ ] Login page works
- [ ] Can login with created credentials
- [ ] Incorrect login shows error
- [ ] Logout button visible
- [ ] Can logout successfully

### Skills (Use Case 2) 
- [ ] Login as admin
- [ ] Can access admin panel
- [ ] Can create skill taxonomy
- [ ] Can create skills in admin panel
- [ ] Skill appears in database
- [ ] Can browse skill catalog
- [ ] Can filter skills by category
- [ ] Skill details page displays

### Requests (Use Case 3)
- [ ] Login as mentee
- [ ] Can create request page displays
- [ ] Can select mentor and skills
- [ ] Request created successfully
- [ ] Request appears in "My Requests"
- [ ] Login as mentor
- [ ] Can see pending requests
- [ ] Can accept/decline requests
- [ ] Notifications appear

### Sessions (Use Case 4)
- [ ] After request acceptance
- [ ] Session created automatically
- [ ] Session appears in "My Sessions"
- [ ] Can view session details
- [ ] Can reschedule session
- [ ] Can cancel session
- [ ] Can mark session complete

### Feedback (Use Case 5)
- [ ] After session completion
- [ ] Feedback form appears
- [ ] Can submit ratings
- [ ] Can write comments
- [ ] Feedback saved to database
- [ ] Can view feedback received
- [ ] Average rating calculated

### Analytics (Use Case 6)
- [ ] Login as HOD
- [ ] Can access analytics dashboard
- [ ] Can view team skills
- [ ] Can see learning progress
- [ ] Statistics display correctly

## Code Quality Checklist

### Code Organization
- [ ] Controllers in `controller/` package
- [ ] Services in `service/` package
- [ ] Repositories in `repository/` package
- [ ] Entities in `entity/` package
- [ ] Templates organized in subdirectories
- [ ] No code in main package root

### Code Standards
- [ ] Naming conventions followed (camelCase)
- [ ] Comments added to complex logic
- [ ] No console.log or debug prints in production
- [ ] Exception handling implemented
- [ ] Proper use of Spring annotations
- [ ] Constructor and getter/setter patterns

### Database
- [ ] All entities have @Entity annotation
- [ ] Primary keys defined with @Id
- [ ] Foreign keys defined properly
- [ ] Relationships mapped correctly
- [ ] Table names match convention (lowercase_with_underscore)
- [ ] Column names match convention

### Security
- [ ] Passwords encrypted with BCrypt
- [ ] Role-based access control implemented
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (JPA parameterized queries)
- [ ] No sensitive data in logs
- [ ] Password fields marked @Transient if needed

## Documentation Checklist

### README.md
- [ ] Project overview present
- [ ] Installation instructions clear
- [ ] Technology stack documented
- [ ] Key features listed
- [ ] Troubleshooting guide included

### SETUP_GUIDE.md
- [ ] Prerequisites listed
- [ ] Step-by-step setup instructions
- [ ] Database configuration explained
- [ ] Common errors documented
- [ ] Testing procedures included

### DEVELOPMENT_GUIDE.md
- [ ] Architecture explained
- [ ] Design patterns documented
- [ ] Database schema provided
- [ ] Extension guidelines given
- [ ] Code samples included

### USE_CASES.md
- [ ] Use cases clearly defined
- [ ] Team assignments specified
- [ ] Integration points documented
- [ ] Development flow described
- [ ] Testing strategy included

### Inline Documentation
- [ ] Classes have JavaDoc comments
- [ ] Complex methods documented
- [ ] Entity relationships explained
- [ ] Service methods documented
- [ ] Controller endpoints documented

## Integration Checklist

### Component Communication
- [ ] Controllers correctly call services
- [ ] Services use repositories
- [ ] Repositories extend JpaRepository
- [ ] Dependency injection working (@Autowired)
- [ ] No hardcoded dependencies

### Data Flow
- [ ] User data persists to database
- [ ] Requests properly stored with references
- [ ] Sessions link to requests correctly
- [ ] Feedback stores user references
- [ ] Notifications created appropriately

### Cross-Feature Integration
- [ ] Authentication required for protected routes
- [ ] Users see only their data
- [ ] Mentors see pending requests
- [ ] Mentees see request status
- [ ] Feedback only shows for completed sessions

## Testing Checklist

### Unit Testing Ready
- [ ] Services have testable methods
- [ ] Repositories can be mocked
- [ ] Controllers follow MVC pattern
- [ ] No business logic in controllers

### Manual Testing Completed
- [ ] Complete user registration flow works
- [ ] Login/logout works for all roles
- [ ] Database CRUD operations verified
- [ ] User restrictions enforced
- [ ] Error messages display correctly

### Browser Compatibility
- [ ] Chrome
- [ ] Firefox  
- [ ] Edge
- [ ] Safari
- [ ] Mobile browsers (if applicable)

## Deployment Checklist

### Build for Production
- [ ] `mvn clean package` succeeds
- [ ] JAR file created: `target/skillswap-1.0.0.jar`
- [ ] Size reasonable (~50-100MB)
- [ ] No error warnings in build log

### Configuration for Production
- [ ] Database URL configured for production
- [ ] Database credentials secured (not in code)
- [ ] Logging level set appropriately
- [ ] Error pages configured
- [ ] CSRF protection enabled

### Deployment
- [ ] Production database created and initialized
- [ ] JAR deployed to server
- [ ] Application starts successfully
- [ ] Can access via production URL
- [ ] Database operations work
- [ ] Monitoring/logging configured

## Red Flags / Issues

If any of these are present, resolve before proceeding:
- [ ] ❌ Compilation errors in IDE
- [ ] ❌ Application fails to start
- [ ] ❌ Cannot connect to database
- [ ] ❌ Templates not rendering
- [ ] ❌ Login always fails
- [ ] ❌ Data not persisting
- [ ] ❌ Foreign key violations
- [ ] ❌ Null pointer exceptions
- [ ] ❌ Hard-coded database credentials
- [ ] ❌ Missing dependencies in pom.xml

## Sign-Off

### Verification Sign-Off

| Item | Owner | Status | Date |
|------|-------|--------|------|
| Environment Setup | [Name] | ✓ / ✗ | [Date] |
| Database Ready | [Name] | ✓ / ✗ | [Date] |
| Application Runs | [Name] | ✓ / ✗ | [Date] |
| Features Work | [Name] | ✓ / ✗ | [Date] |
| Documentation Complete | [Name] | ✓ / ✗ | [Date] |

### Team Review

- [ ] Code reviewed by peer
- [ ] Feedback incorporated
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Ready for integration

## Next Actions

Once all checkboxes are complete:

1. **For Individual Development**: Start working on your assigned use case
2. **For Team Integration**: Coordinate with other team members
3. **For Testing**: Follow the test scenarios in USE_CASES.md
4. **For Deployment**: Follow deployment checklist in SETUP_GUIDE.md

## Support Resources

If stuck on any checklist item:

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation section
2. Check [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Architecture section
3. Check [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Quick reference
4. Review error logs in console
5. Check MySQL error logs
6. Ask team lead or senior developer

## Final Notes

- This checklist should be completed before each phase
- Review this checklist when onboarding new team members
- Update this checklist as project evolves
- Maintain this checklist throughout development

---

**Checklist Version**: 1.0  
**Last Updated**: March 2024
**To Use**: Print this document or save as copy and mark as you go
