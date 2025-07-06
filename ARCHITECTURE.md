### Tech Stack
- Next.js
- Supabase
- Tailwind CSS
- Shadcn UI
- TypeScript

### DB Schema

```
+----------------------+
|       leads          |
+----------------------+
| id (PK)              |
| name                 |
| role                 |
| company              |
| linkedin_url         |
| status               |
| user_id (FK)         |
| created_at           |
| updated_at           |
+----------------------+
           |
           | 1
           |
          / \
         /   \  many
        v     v
+----------------------+
|      messages        |
+----------------------+
| id (PK)              |
| lead_id (FK)         |
| content              |
| user_id (FK)         |
| created_at           |
| updated_at           |
+----------------------+

Legend:
- PK = Primary Key
- FK = Foreign Key
- One lead can have many messages
- Both tables are linked to auth.users via user_id
```


## Key components
- lead-dashboard // For managing leads
- lead-new-button // Button to create a new lead
- message-sheet // For displaying messages related to a lead

## API
see `app/actions.ts`
