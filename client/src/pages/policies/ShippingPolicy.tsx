const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Shipping Methods</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer the following shipping options:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Standard Shipping:</strong> 5-7 business days - $10</li>
              <li><strong>Express Shipping:</strong> 2-3 business days - $20</li>
              <li><strong>Free Shipping:</strong> Orders over $50 (5-7 business days)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Processing Time</h2>
            <p className="text-gray-600 leading-relaxed">
              Orders are typically processed within 1-2 business days. You will receive a confirmation email with tracking information once your order ships.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Shipping Locations</h2>
            <p className="text-gray-600 leading-relaxed">
              We currently ship to all locations within Nigeria. International shipping is not available at this time but coming soon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Tracking Your Order</h2>
            <p className="text-gray-600 leading-relaxed">
              Once shipped, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Delivery Issues</h2>
            <p className="text-gray-600 leading-relaxed">
              If your package is lost or damaged during shipping, please contact us within 48 hours of expected delivery. We will work with the carrier to resolve the issue.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Address Changes</h2>
            <p className="text-gray-600 leading-relaxed">
              Address changes must be requested within 24 hours of placing your order. After shipment, we cannot modify the delivery address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For shipping inquiries, contact support@shoppa.com or call +234 801 234 5678.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
