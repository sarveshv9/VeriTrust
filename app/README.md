# API Endpoints

> For every POST/PUT request in Postman: Body → raw → JSON

---

## POST /register
No body required.
```json
// Response
{
    "success": true,
    "data": {
        "publicKey": "MIIBIjAN...",
        "privateKey": "MIIEvAIB..."
    }
}
```
Save both keys. Private key is shown once only.

---

## POST /login
```json
// Body
{
    "privateKey": "MIIEvAIB..."
}

// Response
{
    "success": true,
    "token": "eyJhbGci..."
}
```
Save the token for all protected routes.

---

## POST /profile
Header: `Authorization: Bearer <token>`
```json
// Body
{
    "name": "Priya Sharma",
    "occupation": "UI/UX Designer",
    "location": "Bangalore, India",
    "contact": "priya@example.com"
}

// Response
{
    "success": true,
    "message": "Profile added to blockchain",
    "blockIndex": 1,
    "blockHash": "7e91bc..."
}
```

---

## PUT /profile
Header: `Authorization: Bearer <token>`
```json
// Body
{
    "name": "Priya Sharma",
    "occupation": "Senior UI/UX Designer",
    "location": "Mumbai, India",
    "contact": "priya@example.com"
}

// Response
{
    "success": true,
    "message": "Profile updated on blockchain",
    "blockIndex": 2,
    "blockHash": "4c12de..."
}
```

---

## GET /profile?key=
No auth. In Postman use the Params tab — add key: `key`, value: the full public key.
```
GET /profile?key=MIIBIjAN...

// Response
{
    "success": true,
    "data": {
        "name": "Priya Sharma",
        "occupation": "UI/UX Designer",
        "location": "Bangalore, India",
        "contactHash": "a3f2c1...",
        "registeredAt": 1709123456789,
        "blockIndex": 1,
        "reviewCount": 1,
        "averageRating": 5
    }
}
```

---

## POST /review
Header: `Authorization: Bearer <token>`

Must be logged in as a **different user** than the subject. Call /register and /login again to get a second account.
```json
// Body
{
    "subjectKey": "MIIBIjAN...",
    "rating": 5,
    "comment": "Exceptional work, very professional!"
}

// Response
{
    "success": true,
    "message": "Review added to blockchain",
    "blockIndex": 3,
    "blockHash": "9c31ab..."
}
```

---

## GET /reviews?key=
No auth. Supports pagination with `offset` and `limit`.
```
GET /reviews?key=MIIBIjAN...&offset=0&limit=10

// Response
{
    "success": true,
    "total": 1,
    "offset": 0,
    "limit": 10,
    "data": [
        {
            "reviewerKey": "MIIBIjAN...",
            "rating": 5,
            "comment": "Exceptional work, very professional!",
            "blockIndex": 3,
            "blockHash": "9c31ab...",
            "timestamp": 1709124000000
        }
    ]
}
```

---

## GET /profiles/count
No auth.
```json
// Response
{
    "success": true,
    "totalProfiles": 2
}
```

---

## GET /
No auth.
```json
// Response
{
    "message": "Gig Reputation API",
    "chain": {
        "length": 4,
        "isValid": true,
        "lastHash": "9c31ab..."
    }
}
```
