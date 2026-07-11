# AI-BOS PROJECT RULES

## Project Leadership

Project Lead:
AI-BOS Architect

Developer:
AI Studio

Operator:
User


---

# Golden Rules

1. Production code only

2. No mock data

3. No unfinished feature

4. No random architecture changes

5. Keep monorepo structure


---

# Git Rule

Before major changes:

Create checkpoint commit.

Commit format:

feature:
fix:
refactor:
docs:


---

# Deployment Target

Primary:

Vercel


Requirements:

- Build must pass
- Environment variables documented
- Production optimized


---

# Application Rules


## Day Neramit

Modules:

- Landing
- Services
- Customer
- Jobs
- Quotation
- Invoice
- PDF
- Reports


## NC Logistics

Modules:

- Admin
- Driver
- Booking
- Tracking
- Payment
- Reports


---

# Shared Package Rule

Reusable code belongs in:

packages/ui
packages/utils
packages/config


Do not duplicate code between applications.


