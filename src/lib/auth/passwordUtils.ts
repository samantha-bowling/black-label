
export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noCommon: boolean;
  };
}

const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890'
];

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !commonPasswords.some(common => 
      password.toLowerCase().includes(common.toLowerCase())
    )
  };

  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (!requirements.length) {
    feedback.push('Use at least 12 characters');
  } else if (password.length >= 16) {
    score += 1;
  }

  // Character variety
  if (!requirements.uppercase) {
    feedback.push('Add uppercase letters');
  } else {
    score += 1;
  }

  if (!requirements.lowercase) {
    feedback.push('Add lowercase letters');
  } else {
    score += 1;
  }

  if (!requirements.numbers) {
    feedback.push('Add numbers');
  } else {
    score += 1;
  }

  if (!requirements.symbols) {
    feedback.push('Add special characters (!@#$%^&*)');
  } else {
    score += 1;
  }

  // Common password check
  if (!requirements.noCommon) {
    feedback.push('Avoid common passwords');
    score = Math.max(0, score - 2);
  }

  // Sequential characters check
  if (hasSequentialChars(password)) {
    feedback.push('Avoid sequential characters (123, abc)');
    score = Math.max(0, score - 1);
  }

  if (feedback.length === 0) {
    feedback.push('Strong password!');
  }

  return {
    score: Math.min(4, score),
    feedback,
    requirements
  };
};

const hasSequentialChars = (password: string): boolean => {
  const sequences = ['123', '234', '345', '456', '567', '678', '789', '890', 
                   'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij'];
  return sequences.some(seq => password.toLowerCase().includes(seq));
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    case 2:
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 3:
      return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    case 4:
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    default:
      return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  }
};

export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Very Weak';
  }
};
