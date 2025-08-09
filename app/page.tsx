import { redirect } from 'next/navigation';

// Root page: immediately send users to the login screen.
// This runs on the server during the initial request; no flash of content.
export const metadata = {
  title: 'Redirecting...'
};

export default function RootRedirect() {
  redirect('/login');
}
