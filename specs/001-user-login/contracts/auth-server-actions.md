# Contract: Auth Server Actions

## Overview

Server Actions that handle authentication logic. These are the only interface between React components and Supabase Auth — no client code calls Supabase Auth directly.

## Actions

### `signUp(email: string, password: string): Promise<ActionResult>`

Creates a new user account and signs them in.

**Input**:
- `email`: Non-empty, valid email format
- `password`: Min 8 chars, 1 upper, 1 lower, 1 number

**Success Response**:
```json
{ "success": true, "redirect": "/" }
```

**Error Responses**:
```json
{ "success": false, "error": "Email already in use" }
{ "success": false, "error": "Password does not meet requirements" }
{ "success": false, "error": "Invalid email format" }
```

**FR**: FR-001, FR-002, FR-003

---

### `signIn(email: string, password: string): Promise<ActionResult>`

Authenticates an existing user.

**Input**:
- `email`: Non-empty string
- `password`: Non-empty string

**Success Response**:
```json
{ "success": true, "redirect": "/" }
```

**Error Response**:
```json
{ "success": false, "error": "Invalid email or password" }
```

**Note**: Same error for both invalid email and invalid password (FR-005).

**FR**: FR-004, FR-005

---

### `signOut(): Promise<ActionResult>`

Ends the current user session.

**Input**: None

**Success Response**:
```json
{ "success": true, "redirect": "/" }
```

**Error Response**:
```json
{ "success": false, "error": "No active session" }
```

**FR**: FR-006

---

### `resetPassword(email: string): Promise<ActionResult>`

Sends a password reset email.

**Input**:
- `email`: Registered email address

**Success Response**:
```json
{ "success": true, "message": "If an account exists, a reset link has been sent" }
```

**Error Response**: Same success message (don't reveal whether email is registered for security).

**FR**: FR-008, FR-009, FR-014

---

### `updatePassword(newPassword: string): Promise<ActionResult>`

Sets a new password after a valid reset.

**Input**:
- `newPassword`: Min 8 chars, 1 upper, 1 lower, 1 number

**Success Response**:
```json
{ "success": true, "redirect": "/" }
```

**Error Responses**:
```json
{ "success": false, "error": "Password does not meet requirements" }
{ "success": false, "error": "Reset link expired or invalid" }
```

**FR**: FR-003, FR-010
