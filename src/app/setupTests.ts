// src/app/setupTests.ts

import '@testing-library/jest-dom';
import mockRouter from 'next-router-mock';

// Mock do next/router (se estiver usando pages/ ainda)
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock do next/navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
