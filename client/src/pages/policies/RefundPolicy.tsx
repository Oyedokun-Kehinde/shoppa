import PageHero from '../../components/PageHero';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Refund Policy"
        subtitle={`Last updated: ${new Date().toLocaleDateString()}`}
        breadcrumbs={[{ label: 'Refund Policy' }]}
        bgImage="https://images.unsplash.com/photo-1556742400-b5b7f1634129?w=1200"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. 30-Day Return Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We offer a 30-day return policy from the date of delivery. Items must be unused, in original packaging, and in the same condition you received them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Refund Process</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To initiate a refund:
            </p>
            <ul className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Contact our support team with your order number</li>
              <li>Provide reason for return and photos if applicable</li>
              <li>Ship the item back to our return address</li>
              <li>Refund will be processed within 5-7 business days after receipt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Non-Refundable Items</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Gift cards</li>
              <li>Downloadable products</li>
              <li>Personal care items</li>
              <li>Items marked as final sale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Return Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              Customers are responsible for return shipping costs unless the item is defective or we made an error. We recommend using a trackable shipping service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Damaged or Defective Items</h2>
            <p className="text-gray-600 leading-relaxed">
              If you receive a damaged or defective item, contact us immediately with photos. We will arrange a free return and full refund or replacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For refund inquiries, contact support@shoppa.com or call +234 801 234 5678.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
