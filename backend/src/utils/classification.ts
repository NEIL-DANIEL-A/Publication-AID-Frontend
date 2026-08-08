export interface ClassificationResult {
  isValid: boolean;
  userType?: 'student' | 'faculty';
  department?: string | null;
  batchYear?: number | null;
  error?: string;
}

const REQUIRED_DOMAIN = 'rajalakshmi.edu.in';

// Faculty pattern: name.initial (e.g. madhusudhan.s@rajalakshmi.edu.in)
const FACULTY_REGEX = /^[a-z]+\.[a-z]$/;

// Student pattern: name.initial.year.dept (e.g. mohamedaaris.p.2024.cse@rajalakshmi.edu.in)
const STUDENT_REGEX = /^[a-z]+\.[a-z]\.(\d{4})\.([a-z]{2,6})$/;

export function classifyCollegeEmail(email: string): ClassificationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Invalid email address' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const parts = cleanEmail.split('@');

  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email format' };
  }

  const [localPart, domain] = parts;

  // Domain check
  if (domain !== REQUIRED_DOMAIN) {
    return {
      isValid: false,
      error: 'Only rajalakshmi.edu.in accounts are allowed',
    };
  }

  // 1. Check Faculty pattern
  if (FACULTY_REGEX.test(localPart)) {
    return {
      isValid: true,
      userType: 'faculty',
      department: null,
      batchYear: null,
    };
  }

  // 2. Check Student pattern
  const studentMatch = localPart.match(STUDENT_REGEX);
  if (studentMatch) {
    const year = parseInt(studentMatch[1], 10);
    const dept = studentMatch[2];

    return {
      isValid: true,
      userType: 'student',
      department: dept,
      batchYear: year,
    };
  }

  // 3. Unrecognized local part format
  return {
    isValid: false,
    error: 'Unrecognized email format — contact admin',
  };
}
