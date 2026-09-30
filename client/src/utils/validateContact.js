// Client-side validation for the contact form (no library). Values are
// trimmed first. Returns an error string, or '' when the field is valid.
export const CONTACT_LIMITS = {
  name: { min: 2, max: 60 },
  message: { min: 10, max: 1000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field, rawValue, msg) {
  const value = (rawValue ?? '').trim();
  const { name, message } = CONTACT_LIMITS;

  switch (field) {
    case 'name':
      if (!value) return msg.nameRequired;
      if (value.length < name.min || value.length > name.max) return msg.nameLength(name.min, name.max);
      return '';
    case 'email':
      if (!value) return msg.emailRequired;
      return EMAIL_RE.test(value) ? '' : msg.emailInvalid;
    case 'message':
      if (!value) return msg.messageRequired;
      if (value.length < message.min || value.length > message.max) {
        return msg.messageLength(message.min, message.max);
      }
      return '';
    default:
      return ''; // subject is optional
  }
}

// Validates every field; returns { field: errorText } for invalid ones only.
export function validateContact(values, msg) {
  return ['name', 'email', 'message'].reduce((errors, field) => {
    const error = validateField(field, values[field], msg);
    return error ? { ...errors, [field]: error } : errors;
  }, {});
}
