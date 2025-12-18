import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCards, { StatCard } from './StatsCards';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('StatsCards Component', () => {
  test('renders all three stat cards with correct data', () => {
    render(<StatsCards />);
    
    // Check if all three stats are rendered
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Brides Served')).toBeInTheDocument();
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction Rate')).toBeInTheDocument();
  });

  test('renders icons for each stat card', () => {
    render(<StatsCards />);
    
    // Check if icons are rendered (emojis)
    expect(screen.getByText('🎨')).toBeInTheDocument();
    expect(screen.getByText('👰')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<StatsCards className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('StatCard Component', () => {
  test('renders individual stat card with props', () => {
    render(
      <StatCard 
        number="25" 
        label="Test Label" 
        icon="🧪" 
        delay={0.1} 
      />
    );
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('🧪')).toBeInTheDocument();
  });

  test('renders without icon when not provided', () => {
    render(<StatCard number="10" label="No Icon" />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('No Icon')).toBeInTheDocument();
    // Should not have any emoji
    expect(screen.queryByText(/[🎨👰⭐🧪]/)).not.toBeInTheDocument();
  });
});