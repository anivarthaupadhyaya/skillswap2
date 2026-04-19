# SkillSwap - Use Cases & Team Assignment

## Project Overview

SkillSwap is divided into use cases, with each team member responsible for implementing a complete use case (from UI to backend to database).

## Use Cases Breakdown

### Use Case 1: User Authentication & Profile Management
**Scope:** Complete user lifecycle management
**Components:**
- Login/Registration UI
- User registration validation
- Password encryption
- Profile management
- Role assignment

**Database Tables:**
- users

**Controllers:**
- AuthController
- DashboardController

**Services:**
- UserService

**Repositories:**
- UserRepository

**Templates:**
- auth/login.html
- auth/register.html
- dashboard/profile.html

**Key Features:**
- Secure login with Spring Security
- Email uniqueness validation
- Role-based dashboard routing
- Password hashing with BCrypt

**Assigned to:** [Student 1]

---

### Use Case 2: Skill Catalog Management
**Scope:** Browse and search available skills in the system
**Components:**
- Skill catalog display
- Search and filtering
- Skill details view
- Skill taxonomy (categories)
- Admin skill management

**Database Tables:**
- skills
- skill_taxonomy

**Controllers:**
- SkillController
- AdminController

**Services:**
- SkillService
- SkillTaxonomyService

**Repositories:**
- SkillRepository
- SkillTaxonomyRepository

**Templates:**
- skills/catalog.html
- skills/detail.html
- admin/taxonomy.html
- admin/skills.html
- admin/skill-form.html

**Key Features:**
- Filter skills by category
- Sort by proficiency level
- Add/edit/delete skills (Admin only)
- Manage skill taxonomy
- Skill search functionality

**Assigned to:** [Student 2]

---

### Use Case 3: Mentorship Request Management
**Scope:** Mentees request skills and mentors manage requests
**Components:**
- Create mentorship requests
- View request status
- Accept/decline requests
- Request history
- Notifications for new requests

**Database Tables:**
- requests
- notifications

**Controllers:**
- RequestController

**Services:**
- RequestService
- NotificationService

**Repositories:**
- RequestRepository
- NotificationRepository

**Templates:**
- requests/create.html
- requests/my-requests.html
- requests/pending.html
- requests/detail.html

**Key Features:**
- Request workflow (PROPOSED → ACCEPTED → COMPLETED)
- Mentor approval system
- Request decline with reason
- Real-time notifications
- Request history tracking
- Status filtering

**Assigned to:** [Student 3]

---

### Use Case 4: Session Scheduling & Management
**Scope:** Schedule, manage, and track mentorship sessions
**Components:**
- Create sessions from accepted requests
- Schedule sessions with date/time
- Session reminders
- Reschedule sessions
- Cancel sessions
- Session history

**Database Tables:**
- sessions

**Controllers:**
- SessionController

**Services:**
- SessionService

**Repositories:**
- SessionRepository

**Templates:**
- sessions/my-sessions.html
- sessions/detail.html
- sessions/reschedule.html

**Key Features:**
- Schedule sessions after request acceptance
- Conflict detection
- Session status tracking (SCHEDULED → IN_PROGRESS → COMPLETED)
- Reschedule with notification
- Cancel with reason
- Session notes and attachments
- Upcoming sessions view

**Assigned to:** [Student 4]

---

### Use Case 5: Feedback & Rating System
**Scope:** Post-session feedback and user ratings
**Components:**
- Feedback form after session completion
- Rating system (1-5 stars)
- Comments and reviews
- Average rating calculation
- Feedback history

**Database Tables:**
- feedback

**Controllers:**
- FeedbackController

**Services:**
- FeedbackService

**Repositories:**
- FeedbackRepository

**Templates:**
- feedback/create.html
- feedback/received.html
- feedback/view.html

**Key Features:**
- Post-session feedback collection
- Multi-dimensional ratings (skill development, communication)
- Comment section
- Average rating display
- Feedback visibility controls
- Rating trends

**Assigned to:** [Student 5]

---

### Use Case 6: Analytics & Reporting (HOD)
**Scope:** Department head monitoring and analytics
**Components:**
- Team skill development tracking
- Mentorship statistics
- Performance reports
- Skill gap analysis
- Team analytics dashboard

**Database Tables:**
- No new tables (queries existing data)

**Controllers:**
- AnalyticsController (new)

**Services:**
- AnalyticsService (new)

**Repositories:**
- Use existing repositories with complex queries

**Templates:**
- dashboard/hod-dashboard.html
- analytics/department-stats.html
- analytics/team-growth.html
- analytics/reports.html

**Key Features:**
- Department team skill inventory
- Skill gap identification
- Learning progress tracking
- Mentorship participation metrics
- Export reports (PDF)
- Skill development trends

**Assigned to:** [Student 6]

---

## How Components Integrate

```
┌─────────────────────────────────────────────────────┐
│ Use Case 1: Authentication (Student 1)              │
│ → Creates users and manages login                     │
└──────────────┬──────────────────────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────────────────────┐
│ Use Case 2: Skill Catalog (Student 2)               │
│ → Provides available skills from database            │
└──────────────┬──────────────────────────────────────┘
               │ Uses
               ▼
┌─────────────────────────────────────────────────────┐
│ Use Case 3: Request Management (Student 3)           │
│ → Mentees request skills, mentors respond            │
└──────────────┬──────────────────────────────────────┘
               │ Creates
               ▼
┌─────────────────────────────────────────────────────┐
│ Use Case 4: Session Management (Student 4)           │
│ → Schedules mentorship sessions from requests        │
└──────────────┬──────────────────────────────────────┘
               │ After completion
               ▼
┌─────────────────────────────────────────────────────┐
│ Use Case 5: Feedback System (Student 5)              │
│ → Collects feedback and rates participants           │
└──────────────┬──────────────────────────────────────┘
               │ Analyzes
               ▼
┌─────────────────────────────────────────────────────┐
│ Use Case 6: Analytics & Reporting (Student 6)        │
│ → HOD monitors team skill development                │
└─────────────────────────────────────────────────────┘
```

## Development Flow

### Phase 1: Foundation (Student 1)
- Setup database
- Implement authentication
- Create login/registration pages
- All other students can now register and test

### Phase 2: Data Setup (Student 2)
- Implement skill management
- Create skill catalog
- Add admin interface for skill creation
- Other students can now browse skills

### Phase 3: Request Workflow (Student 3)
- Build request creation
- Implement request approval flow
- Add notifications
- Mentees can now create requests

### Phase 4: Session Management (Student 4)
- Schedule sessions from approved requests
- Implement session tracking
- Add reschedule/cancel

### Phase 5: Quality & Feedback (Student 5)
- Build feedback forms
- Implement rating system
- Display user ratings

### Phase 6: Analytics & Reporting (Student 6)
- Implement HOD dashboard
- Create analytics queries
- Build reports

## Integration Points

### Data Flow Examples

**User Registration → Skill Browsing:**
```
User (UC1) → Skills (UC2) → Browse Catalog
```

**Request Creation → Session Scheduling:**
```
Request (UC3) → Approved → Session (UC4) → Complete → Feedback (UC5)
```

**Session Completion → Analytics:**
```
Session (UC4) → Feedback (UC5) → Analytics (UC6)
```

## Database Dependency Chain

```
users
├─ Can view: skills
├─ Can create: requests
├─ Can create: sessions (from requests)
├─ Can receive: feedback (from sessions)
└─ Can view: notifications (from requests)
```

## Repository Pattern Integration

Each student will use repository interfaces defined in their service:

```java
// Student 1 - AuthController uses UserRepository
UserRepository.findByEmail(email)

// Student 2 - SkillController uses SkillRepository  
SkillRepository.findByIsActiveTrue()

// Student 3 - RequestController uses RequestRepository
RequestRepository.findByMentorUserIdAndStatus(mentorId, PROPOSED)

// Student 4 - SessionController uses SessionRepository
SessionRepository.findByMenteeUserId(userId)

// Student 5 - FeedbackController uses FeedbackRepository
FeedbackRepository.findByGivenToUserId(userId)

// Student 6 - AnalyticsController uses multiple repositories
SessionRepository + FeedbackRepository + RequestRepository
```

## API Contract Examples

### Endpoint Dependencies

**Student 1 Provides:**
- POST /auth/login
- POST /auth/register
- GET /auth/logout

**Student 2 Requires UC1 and Provides:**
- GET /skills/catalog
- GET /skills/{skillId}
- POST /admin/skills (requires ADMIN role from UC1)

**Student 3 Requires UC1 & UC2 and Provides:**
- POST /requests/create
- GET /requests/my-requests
- POST /requests/{requestId}/accept

**Student 4 Requires UC1 & UC3 and Provides:**
- POST /sessions/create
- GET /sessions/my-sessions
- POST /sessions/{sessionId}/complete

**Student 5 Requires UC1 & UC4 and Provides:**
- POST /feedback/submit
- GET /feedback/received

**Student 6 Requires UC1, UC3, UC4, UC5 and Provides:**
- GET /analytics/department
- GET /analytics/reports

## Testing Strategy

### Unit Testing
Each student tests their own services and controllers

### Integration Testing
Test your use case with other use cases
- UC1 → UC2 → UC3 → UC4 → UC5 → UC6

### End-to-End Testing
Perform complete workflows:
1. Register user
2. Browse skills
3. Create request
4. Accept request
5. Schedule session
6. Complete session
7. Submit feedback
8. View analytics

## Deployment Order

1. Deploy UC1 (Authentication) - Database foundation
2. Deploy UC2 (Skills) - Data setup
3. Deploy UC3 (Requests) - Core workflow
4. Deploy UC4 (Sessions) - Scheduling
5. Deploy UC5 (Feedback) - Quality
6. Deploy UC6 (Analytics) - Reporting

## Merge Strategy

```
main branch (production)
│
├─── staging (integration testing)
│    ├── uc1-auth
│    ├── uc2-skills
│    ├── uc3-requests
│    ├── uc4-sessions
│    ├── uc5-feedback
│    └── uc6-analytics
│
└── (Each student works on their branch)
```

## Handoff Documentation

Each student should provide:
1. **API Documentation**
   - Endpoints created
   - Request/response formats
   - Error codes

2. **Database Schema**
   - Tables created/modified
   - Relationships established

3. **Code Comments**
   - Complex logic explained
   - Integration points documented

4. **Testing Guide**
   - How to test the feature
   - Sample test data

5. **Deployment Notes**
   - Any special setup required
   - Migration scripts needed

## Communication & Coordination

- Daily sync-ups (15 mins)
- Weekly integration testing
- Slack/Email for async updates
- Shared documentation updates
- Code review before merges

---

**Last Updated:** March 2024
**Version:** 1.0.0
