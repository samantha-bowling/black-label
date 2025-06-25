
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoleSelectionStep } from '@/components/onboarding/RoleSelectionStep';

// Mock the hooks
vi.mock('@/hooks/useSession', () => ({
  useSession: () => ({
    user: { id: 'test-id', role: null },
    upsertUserProgress: vi.fn(),
    refreshUser: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RoleSelectionStep', () => {
  it('renders when user role is null', () => {
    const onComplete = vi.fn();
    render(<RoleSelectionStep onComplete={onComplete} />);
    
    expect(screen.getByText('Welcome to BlackLabel.gg')).toBeInTheDocument();
    expect(screen.getByText("I'm here to find work")).toBeInTheDocument();
    expect(screen.getByText("I'm here to hire talent")).toBeInTheDocument();
  });

  // TODO: Add more tests for role selection behavior
  it('should allow role selection', () => {
    // Placeholder for future test implementation
    expect(true).toBe(true);
  });
});
