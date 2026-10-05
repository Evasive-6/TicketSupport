const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Open', 'In Progress', 'Resolved'];
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function validateCreateTicket(data) {
  const errors = {};

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: { body: 'Request body must be a valid JSON object.' }
    };
  }

  // Title validation: required, max 120 chars
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Title is required.';
  } else if (data.title.trim().length > 120) {
    errors.title = `Title must not exceed 120 characters. Current length: ${data.title.trim().length}.`;
  }

  // Description validation: required
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.description = 'Description is required.';
  }

  // Customer email validation: required, valid format
  if (!data.customer_email || typeof data.customer_email !== 'string' || data.customer_email.trim().length === 0) {
    errors.customer_email = 'Customer email is required.';
  } else if (!EMAIL_REGEX.test(data.customer_email.trim())) {
    errors.customer_email = 'Please provide a valid email address (e.g., user@example.com).';
  }

  // Priority validation: Low, Medium, or High
  if (!data.priority || typeof data.priority !== 'string' || !VALID_PRIORITIES.includes(data.priority)) {
    errors.priority = `Priority is required and must be one of: ${VALID_PRIORITIES.join(', ')}.`;
  }

  // Status validation (optional on creation; defaults to 'Open')
  if (data.status !== undefined && data.status !== null) {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateUpdateTicket(data) {
  const errors = {};

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return {
      isValid: false,
      errors: { body: 'At least one field (status or priority) must be provided for update.' }
    };
  }

  let hasValidField = false;

  // Status validation
  if (data.status !== undefined) {
    hasValidField = true;
    if (!VALID_STATUSES.includes(data.status)) {
      errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}.`;
    }
  }

  // Priority validation
  if (data.priority !== undefined) {
    hasValidField = true;
    if (!VALID_PRIORITIES.includes(data.priority)) {
      errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`;
    }
  }

  // Title validation if provided
  if (data.title !== undefined) {
    hasValidField = true;
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.title = 'Title cannot be empty.';
    } else if (data.title.trim().length > 120) {
      errors.title = `Title must not exceed 120 characters. Current length: ${data.title.trim().length}.`;
    }
  }

  // Description validation if provided
  if (data.description !== undefined) {
    hasValidField = true;
    if (typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.description = 'Description cannot be empty.';
    }
  }

  if (!hasValidField) {
    errors.fields = 'You must provide at least one valid field to update (e.g. status or priority).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
