# Technical Debt & Improvement Notes

## General Code Quality
- **Type Safety:** I noticed some places use `any` or do not validate API response types. If I had more time, I would use TypeScript interfaces everywhere, especially for API responses, to improve reliability and maintainability.
- **Error Handling:** API calls in the frontend do not handle errors (e.g., network errors, 500s). I would add try/catch blocks and user feedback for failures to make the app more robust.
- **Debounce Logic:** The debounce is implemented with a ref and manual cleanup. I would refactor this into a custom hook to avoid repetition and potential bugs.
- **Magic Numbers:** Values like `PAGE_SIZE = 5` and scroll thresholds (`-50`) are hardcoded. I would move these to constants or config files for easier tuning and clarity.
- **Inline Styles:** Some styles are inline (e.g., highlight background). I would prefer Tailwind or CSS classes for consistency and maintainability.

## UI/UX
- **Accessibility:** 
  - I would ensure all interactive elements (buttons, inputs) have accessible labels and roles.
  - Highlighted text currently uses color only; I would consider adding an underline or bold for users with color vision deficiency.
- **Sticky Header/Filter:** The sticky header and filter bar use fixed pixel values (`top-[56px]`). If I had more time, I would make this dynamic or use CSS variables for easier layout changes.
- **Loading States:** "Loading more..." is shown, but there is no spinner or skeleton loader. I would add visual feedback for loading states.

## Performance
- **Client-side Filtering:** All advocates are loaded and filtered client-side. For large datasets, I would switch to paginated API queries and server-side filtering.
- **Infinite Scroll:** The infinite scroll loads more items but does not prevent duplicate loads if the user scrolls quickly. I would add a loading flag to prevent race conditions.
- **API Filtering:** The API filtering logic is duplicated on both client and server. I would move all filtering to the backend for consistency and scalability.

## Backend/API
- **SQL Injection:** The API route builds SQL queries with template strings. I would ensure all user input is properly escaped and parameterized.
- **Specialties Field:** The specialties field is assumed to be a JSON array. I would validate and sanitize this field in the database and API.
- **Pagination:** The API does not support pagination. I would add `limit` and `offset` parameters for scalable data fetching.

## Code Organization
- **Component Props:** Some components (e.g., `AdvocateCard`) accept many props. I would consider using context or grouping related props into objects for better maintainability.
- **File Structure:** All components are in the same folder. For larger projects, I would split into `components/`, `hooks/`, `api/`, etc.
- **Custom Hooks:** I would extract repeated logic (debounce, infinite scroll) into reusable hooks.

## Testing
- **Unit Tests:** There are no unit or integration tests present. If I had more time, I would add tests for filtering logic, API endpoints, and UI components.
- **Edge Cases:** I would test for empty states, error states, and accessibility.

## Extensibility
- **Filter Options:** Currently only text search is supported. I would consider adding filters for city, degree, experience, etc.
- **Sorting:** I would allow users to sort advocates by name, experience, or other fields.
- **Mobile Responsiveness:** I would ensure layout and scroll behavior work well on mobile devices.

---

## Summary

If I had more time, I would:
- Move all filtering and pagination to the backend.
- Improve error handling and accessibility.
- Refactor debounce and infinite scroll logic into hooks.
- Add tests and better code organization.
- Prepare for scalability with paginated API and dynamic UI.
