
import { MultiSelectPills } from './MultiSelectPills';

const AWARDS_OPTIONS = [
  // Game Industry Awards
  'BAFTA Game Award Winner',
  'BAFTA Game Award Nominee',
  'The Game Awards Winner',
  'The Game Awards Nominee',
  'D.I.C.E. Award Winner',
  'D.I.C.E. Award Nominee',
  'GDC Award Winner',
  'GDC Award Nominee',
  'IGF Winner',
  'IGF Honorable Mention',
  'IndieCade Winner',
  'IndieCade Selection',
  'Develop:Star Winner',
  'SXSW Game Awards Winner',
  'Webby Award Winner (Games)',
  
  // Genre or Role-Based Recognition
  'Game of the Year (GOTY)',
  'Best Narrative',
  'Best Art Direction',
  'Best Audio Design',
  'Best Debut Indie',
  'Best Innovation in Accessibility',
  'Best Performance (Voice or Mocap)',
  'Best Multiplayer',
  'Best VR/AR Experience',
  
  // Professional Milestones
  'Forbes 30 Under 30 (Games)',
  'Apple Design Award',
  'Unity Awards Winner',
  'Unreal Dev Grant Recipient',
  'Epic MegaGrant Recipient',
  'Game Jam Winner',
  'Kickstarter Success',
  'Steam Top Seller',
  'Humble Bundle Spotlight',
  
  // Legacy & Community Honors
  'Lifetime Achievement',
  'Studio of the Year (Team Contribution)',
  'Featured in Game Informer / IGN / Polygon',
  'GDC Speaker',
  'BAFTA Breakthrough',
  'Women in Games Honoree',
  'Black in Gaming Honoree',
  'Latinx in Gaming Honoree',
  'LGBTQ+ in Games Honoree'
];

interface AwardsSelectorProps {
  selectedAwards: string[];
  onChange: (awards: string[]) => void;
}

export function AwardsSelector({ selectedAwards, onChange }: AwardsSelectorProps) {
  return (
    <MultiSelectPills
      label="Awards & Accolades"
      options={AWARDS_OPTIONS}
      selectedOptions={selectedAwards}
      onChange={onChange}
      maxSelections={5}
      description="Surface career highlights in a credentialed way (max 5)"
      placeholder="Select your awards and accolades"
    />
  );
}
