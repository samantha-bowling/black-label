import { FormFieldConfig } from '@/components/forms/FormFieldGroup';
import { PosterType } from '@/types/auth';

// Shared onboarding fields - removed location and years_experience to avoid duplication
export const sharedOnboardingFields: FormFieldConfig[] = [
  {
    id: 'display_name',
    label: 'Display Name',
    type: 'text',
    placeholder: 'How should others see your name?',
    required: true,
    validation: { required: 'Display name is required' }
  },
  {
    id: 'bio',
    label: 'Bio',
    type: 'textarea',
    placeholder: 'Tell us about yourself...',
    description: 'Share your background, interests, and what makes you unique (750 characters max)',
    validation: { 
      maxLength: { 
        value: 750, 
        message: 'Bio must be 750 characters or less' 
      } 
    }
  }
];

// Social links fields
export const socialLinksFields: FormFieldConfig[] = [
  {
    id: 'social_links.linkedin',
    label: 'LinkedIn',
    type: 'url',
    placeholder: 'https://linkedin.com/in/username'
  },
  {
    id: 'social_links.github',
    label: 'GitHub',
    type: 'url',
    placeholder: 'https://github.com/username'
  },
  {
    id: 'social_links.website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://yourwebsite.com'
  }
];

// Gig seeker fields - updated availability options
export const gigSeekerWorkPreferencesFields: FormFieldConfig[] = [
  {
    id: 'availability_status',
    label: 'Current Status',
    type: 'select',
    placeholder: 'Select your availability',
    options: [
      { value: 'open', label: 'Open to offers' },
      { value: 'selective', label: 'Selective about offers' },
      { value: 'not-looking', label: 'Not currently looking' },
      { value: 'taking-break', label: 'Taking a break' },
      { value: 'busy-interested', label: 'Busy but interested' }
    ]
  }
];

// Available for options
export const AVAILABLE_FOR_OPTIONS = [
  'Freelance', 'Embedded', 'Retainer', 'Contract', 'Full-time', 'Part-time', 'Consulting'
];

// Work style options
export const WORK_STYLE_OPTIONS = [
  'Remote OK', 'Async Friendly', 'Open to Intros', 'Hybrid', 'On-Site', 'Flexible Hours', 'Cross-timezone'
];

// Remove the old rate fields - they'll be handled by RateSelector component
export const gigSeekerRateFields: FormFieldConfig[] = [];

// Remove the story fields - removing Notable Projects & Accomplishments
export const gigSeekerStoryFields: FormFieldConfig[] = [];

// Gig poster fields remain the same
export const gigPosterCompanyFields: FormFieldConfig[] = [
  {
    id: 'company_name',
    label: 'Company/Studio Name',
    type: 'text',
    placeholder: 'Your company or studio name'
  },
  {
    id: 'poster_type',
    label: 'Organization Type',
    type: 'select',
    placeholder: 'Select type',
    options: [
      { value: 'individual', label: 'Individual' },
      { value: 'indie_dev', label: 'Indie Developer' },
      { value: 'studio', label: 'Studio' },
      { value: 'agency', label: 'Agency' },
      { value: 'publisher', label: 'Publisher' }
    ]
  },
  {
    id: 'location',
    label: 'Location',
    type: 'text',
    placeholder: 'City, Country'
  }
];

export const gigPosterBudgetFields: FormFieldConfig[] = [
  {
    id: 'typical_budget_min',
    label: 'Typical Budget Range ($) - Min',
    type: 'number',
    placeholder: '1000',
    gridSpan: 1
  },
  {
    id: 'typical_budget_max',
    label: 'Typical Budget Range ($) - Max',
    type: 'number',
    placeholder: '10000',
    gridSpan: 1
  }
];

export const gigPosterProjectFields: FormFieldConfig[] = [
  {
    id: 'timeline_expectations',
    label: 'Timeline Expectations',
    type: 'textarea',
    placeholder: 'Describe your typical project timelines and expectations...'
  },
  {
    id: 'nda_required',
    label: 'I typically require NDAs for my projects',
    type: 'checkbox'
  }
];

export const gigPosterContactFields: FormFieldConfig[] = [
  {
    id: 'website_url',
    label: 'Website',
    type: 'url',
    placeholder: 'https://yourcompany.com',
    gridSpan: 1
  },
  {
    id: 'linkedin_url',
    label: 'LinkedIn',
    type: 'url',
    placeholder: 'https://linkedin.com/in/yourprofile',
    gridSpan: 1
  }
];
