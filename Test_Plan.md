# Test Plan

## Objectives
Verify task creation, display, status toggling, deletion, and realtime updates.

## Test Cases
1. Create task with title only -> appears in list.
2. Create task with due date -> due date displayed correctly.
3. Toggle status -> status updates and dashboard count changes.
4. Delete task -> removed from list and Firestore.
5. Concurrent update -> two browsers reflect changes in realtime.
