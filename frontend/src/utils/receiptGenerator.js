import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateReceipt = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header & Branding
    doc.setFontSize(22);
    doc.setTextColor(76, 81, 191); // Primary color
    doc.text('TRINITY STORE', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Muted color
    doc.text('Digital Receipt', 20, 32);

    doc.setDrawColor(226, 232, 240); // Border color
    doc.line(20, 40, pageWidth - 20, 40);

    // 2. Order Information
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // Main text
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', 20, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Order ID: #${order._id.toUpperCase()}`, 20, 60);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 66);
    doc.text(`Status: ${order.paymentStatus.toUpperCase()}`, 20, 72);

    // 3. Items Table
    const tableColumn = ["Product", "Price", "Qty", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
        const itemData = [
            item.productId?.name || "Product",
            `$${item.priceAtPurchase.toFixed(2)}`,
            item.quantity,
            `$${item.subtotal.toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: {
            fillColor: [76, 81, 191],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [30, 41, 59]
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        margin: { top: 85, left: 20, right: 20 },
    });

    // 4. Totals Summary
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Subtotal:', pageWidth - 80, finalY);
    doc.setTextColor(30, 41, 59);
    doc.text(`$${order.totalAmount.toFixed(2)}`, pageWidth - 40, finalY, { align: 'right' });

    doc.setTextColor(100, 116, 139);
    doc.text('Shipping:', pageWidth - 80, finalY + 6);
    doc.setTextColor(22, 101, 52); // Success green
    doc.text('FREE', pageWidth - 40, finalY + 6, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(pageWidth - 80, finalY + 10, pageWidth - 20, finalY + 10);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(76, 81, 191);
    doc.text('Total:', pageWidth - 80, finalY + 20);
    doc.text(`$${order.totalAmount.toFixed(2)}`, pageWidth - 40, finalY + 20, { align: 'right' });

    // 5. Footer Message
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for shopping with Trinity Store.', pageWidth / 2, finalY + 40, { align: 'center' });
    doc.text('This is a computer-generated document.', pageWidth / 2, finalY + 45, { align: 'center' });

    // Save PDF
    doc.save(`Receipt_Order_${order._id.slice(-8).toUpperCase()}.pdf`);
};
