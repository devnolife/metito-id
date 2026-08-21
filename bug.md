# Metito Admin Panel Bug Fixes

You are a senior web developer tasked with fixing critical bugs in the Metito admin panel. Below are the specific issues that need to be resolved:

## Critical Issues Summary

### 1. Input Field Focus Loss Bug (HIGH PRIORITY)
**Affected Pages:**
- `/admin/gallery` - Add Photo form
- `/admin/customers` - Add Customer form  
- `/admin/certifications` - Add Certificate form
- `/admin/blog` - Add Blog form

**Problem:** Input fields lose focus after typing a single character, requiring users to repeatedly click to continue typing.

**Requirements:**
- Investigate the root cause of focus loss in form inputs
- Fix the focus management issue across all affected forms
- Ensure smooth typing experience without interruptions
- Test all input fields thoroughly after the fix

### 2. Services Management Functionality (MEDIUM PRIORITY)
**Affected Page:** `/admin/services`

**Problems:**
- Delete button cannot remove existing services
- Edit button cannot modify existing services

**Requirements:**
- Fix the delete functionality for existing services
- Fix the edit functionality for existing services
- Ensure proper error handling and user feedback
- Maintain data integrity during operations

### 3. Products Edit Feature (LOW PRIORITY)
**Affected Page:** `/admin/products`

**Problem:** Edit button shows "Coming Soon" status

**Requirements:**
- Implement full edit functionality for products
- Follow the same UI/UX patterns as other working edit features

## Technical Investigation Guidelines

### For Focus Loss Bug:
1. Check for JavaScript event handlers that might be rebinding
2. Look for React/Vue component re-rendering issues
3. Examine form validation that might be resetting state
4. Check for conflicting CSS or JavaScript libraries
5. Verify proper key handling in input components

### For Services CRUD Operations:
1. Check API endpoints for delete and edit operations
2. Verify proper authentication and authorization
3. Look for missing event handlers or broken routing
4. Check database constraints that might prevent operations
5. Ensure proper error handling and user feedback

### Common Areas to Investigate:
- Form state management
- Event handling and propagation
- API integration and error handling
- Component lifecycle management
- CSS conflicts affecting functionality

## Success Criteria

### Must Have:
- All input fields maintain focus during typing
- Delete and edit functions work for services
- No regression in existing working features
- Proper error handling and user feedback

### Should Have:
- Products edit functionality implemented
- Consistent UI/UX across all admin sections
- Performance optimizations if needed

## Testing Requirements

1. **Manual Testing:**
   - Test all form inputs for focus retention
   - Verify CRUD operations on all admin sections
   - Cross-browser compatibility check

2. **Automated Testing:**
   - Write unit tests for fixed components
   - Integration tests for API operations
   - E2E tests for critical user workflows

## Code Quality Standards

- Follow existing code structure and naming conventions
- Add proper error handling and logging
- Include JSDoc comments for complex functions
- Ensure responsive design compatibility
- Optimize for performance and accessibility

## Deliverables

1. Fixed code with detailed comments explaining changes
2. Test cases covering the fixed functionality
3. Documentation of root causes and solutions
4. Migration guide if database changes are needed

Please prioritize the focus loss bug as it affects user experience significantly across multiple admin sections.
