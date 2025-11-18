import { Download, Printer, Check } from 'lucide-react';
import { useRef } from 'react';

interface ReceiptProps {
  order: any;
  onClose?: () => void;
}

const Receipt = ({ order, onClose }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printContent = receiptRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - Order #${order.id}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt-container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 28px; font-weight: bold; color: #4F46E5; }
                .divider { border-bottom: 2px solid #e5e7eb; margin: 20px 0; }
                .section { margin: 20px 0; }
                .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
                .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
                .label { color: #6b7280; }
                .value { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
                th { background-color: #f3f4f6; font-weight: 600; }
                .total-section { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
                .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
                .total-amount { font-size: 24px; font-weight: bold; color: #4F46E5; }
                .footer { text-align: center; margin-top: 40px; color: #6b7280; font-size: 14px; }
                .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
                .status-paid { background-color: #dcfce7; color: #166534; }
                .status-pending { background-color: #fef3c7; color: #92400e; }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header Actions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl no-print">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Payment Receipt</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-8 receipt-container">
          {/* Company Header */}
          <div className="header text-center mb-8">
            <div className="logo text-4xl font-bold text-indigo-600 mb-2">Shoppa</div>
            <p className="text-gray-600">Your Trusted Online Shopping Partner</p>
            <p className="text-sm text-gray-500 mt-2">
              📧 support@shoppa.com | 📞 +234-XXX-XXX-XXXX
            </p>
          </div>

          <div className="divider"></div>

          {/* Payment Success Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-full px-6 py-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold text-green-700">Payment Successful</span>
            </div>
          </div>

          {/* Order Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="section">
              <h3 className="section-title text-gray-700">Order Details</h3>
              <div className="space-y-2">
                <div className="info-row">
                  <span className="label">Order Number:</span>
                  <span className="value">#{order.id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Order Date:</span>
                  <span className="value">{formatDate(order.created_at || order.createdAt)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{order.payment_method || 'Paystack'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Status:</span>
                  <span className={`status-badge ${order.is_paid ? 'status-paid' : 'status-pending'}`}>
                    {order.is_paid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title text-gray-700">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">{order.shipping_address_address}</p>
                <p>{order.shipping_address_city}</p>
                <p>{order.shipping_address_postal_code}</p>
                <p>{order.shipping_address_country}</p>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Order Items */}
          <div className="section">
            <h3 className="section-title text-gray-700 mb-4">Order Items</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(parseFloat(item.price))}</td>
                    <td className="text-right font-semibold">
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Section */}
          <div className="total-section">
            <div className="total-row">
              <span className="label">Subtotal:</span>
              <span className="value">{formatCurrency(parseFloat(order.total_price) - parseFloat(order.shipping_price) - parseFloat(order.tax_price))}</span>
            </div>
            <div className="total-row">
              <span className="label">Tax:</span>
              <span className="value">{formatCurrency(parseFloat(order.tax_price))}</span>
            </div>
            <div className="total-row">
              <span className="label">Shipping:</span>
              <span className="value">{formatCurrency(parseFloat(order.shipping_price))}</span>
            </div>
            <div className="divider my-3"></div>
            <div className="total-row">
              <span className="text-xl font-bold text-gray-900">Total Amount:</span>
              <span className="total-amount">{formatCurrency(parseFloat(order.total_price))}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer mt-8 pt-6 border-t-2 border-gray-200">
            <p className="font-semibold mb-2">Thank you for shopping with Shoppa!</p>
            <p className="text-xs">
              This is a computer-generated receipt and does not require a signature.
            </p>
            <p className="text-xs mt-2">
              For any queries, please contact our customer support at support@shoppa.com
            </p>
            <div className="mt-4">
              <p className="text-xs">Receipt generated on {new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
