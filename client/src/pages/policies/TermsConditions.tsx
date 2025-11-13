import PageHero from '../../components/PageHero';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Terms & Conditions"
        subtitle={`Last updated: ${new Date().toLocaleDateString()}`}
        breadcrumbs={[{ label: 'Terms & Conditions' }]}
        bgImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using Shoppa, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. User Account</h2>
            <p className="text-gray-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Product Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Orders and Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before order processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including text, graphics, logos, and images, is the property of Shoppa and protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Shoppa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms, contact us at support@shoppa.com or +234 801 234 5678.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
