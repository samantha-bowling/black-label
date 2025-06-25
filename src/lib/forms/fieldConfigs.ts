
import { FormFieldConfig } from '@/components/forms/FormFieldGroup';
import { PosterType } from '@/types/auth';

// Shared onboarding fields
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
    description: 'Share your background, interests, and what makes you unique'
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

// Gig seeker fields
export const gigSeekerWorkPreferencesFields: FormFieldConfig[] = [
  {
    id: 'availability_status',
    label: 'Availability Status',
    type: 'select',
    placeholder: 'Select your availability',
    options: [
      { value: 'open', label: 'Open to offers' },
      { value: 'selective', label: 'Selective about offers' },
      { value: 'not-looking', label: 'Not currently looking' }
    ]
  }
];

export const gigSeekerRateFields: FormFieldConfig[] = [
  {
    id: 'rate_range_min',
    label: 'Rate Range ($/hour) - Min',
    type: 'number',
    placeholder: '25',
    gridSpan: 1
  },
  {
    id: 'rate_range_max',
    label: 'Rate Range ($/hour) - Max',
    type: 'number',
    placeholder: '75',
    gridSpan: 1
  }
];

export const gigSeekerStoryFields: FormFieldConfig[] = [
  {
    id: 'past_credits',
    label: 'Notable Projects & Accomplishments',
    type: 'textarea',
    placeholder: 'Share your standout projects, games you\'ve shipped, notable achievements, or impactful work that demonstrates your expertise...',
    description: 'Focus on outcomes and impact rather than just responsibilities'
  }
];

// Gig poster fields
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
