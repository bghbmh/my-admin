
export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className="auth-wrapper">
			{children}
		</section>
	);
}