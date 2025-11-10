import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Ordering & Payment',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted.',
        },
        {
          question: 'Can I modify or cancel my order?',
          answer:
            'Orders can be modified or cancelled within 2 hours of placement. Please contact our customer service team immediately if you need to make changes.',
        },
        {
          question: 'Do you offer gift wrapping?',
          answer:
            'Yes! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option during checkout.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight shipping are also available at checkout.',
        },
        {
          question: 'Do you ship internationally?',
          answer:
            'Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically 7-14 business days.',
        },
        {
          question: 'How can I track my order?',
          answer:
            'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy for all unused items in original packaging. Returns are free for U.S. customers.',
        },
        {
          question: 'How do I return an item?',
          answer:
            'Log into your account, go to Order History, and select the item you wish to return. Print the prepaid return label and ship it back to us.',
        },
        {
          question: 'When will I receive my refund?',
          answer:
            'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.',
        },
      ],
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I create an account?',
          answer:
            'Click on "Login" in the top right corner, then select "Create Account". Fill in your details, and you\'re all set!',
        },
        {
          question: 'Is my personal information secure?',
          answer:
            'Absolutely. We use industry-standard SSL encryption to protect your data. We never share your information with third parties.',
        },
        {
          question: 'I forgot my password. What should I do?',
          answer:
            'Click on "Forgot Password" on the login page. Enter your email, and we\'ll send you instructions to reset your password.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">Find answers to common questions</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-3xl font-bold mb-6 text-primary">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={faqIndex} className="card overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center card p-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help you 24/7.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
