import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { InvoiceState, InvoiceCalculations } from '@/lib/types';
import { formatMoney } from '@/lib/formatting';

interface InvoicePdfProps {
  state: InvoiceState;
  calculations: InvoiceCalculations;
  logoSrc: string;
}

const TEAL = '#2B7A78';
const ROW_EVEN = '#f0f4f8';
const ROW_ODD = '#ffffff';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 0,
    color: '#333333',
  },
  // Header bar — full width teal
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TEAL,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    objectFit: 'contain',
  },
  headerCompanyName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
  },
  headerInvoice: {
    fontSize: 28,
    color: '#ffffff',
  },
  // Content area with padding
  content: {
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  // Info section: company/bank left, metadata right
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoLeft: {
    width: '55%',
  },
  infoRight: {
    width: '40%',
  },
  companyAddress: {
    fontSize: 9,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    marginBottom: 8,
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    marginBottom: 8,
  },
  bankLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: TEAL,
    marginBottom: 3,
  },
  bankText: {
    fontSize: 9,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  // Metadata box
  metadataBox: {
    backgroundColor: TEAL,
    borderRadius: 4,
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 8,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  // Bill To
  billToLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: TEAL,
    marginBottom: 4,
  },
  billToName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    marginBottom: 2,
  },
  billToAddress: {
    fontSize: 9,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    marginBottom: 20,
  },
  // Table
  table: {
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: TEAL,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  colNum: { width: '6%', textAlign: 'center' },
  colDesc: { width: '44%' },
  colQty: { width: '14%', textAlign: 'right' },
  colPrice: { width: '18%', textAlign: 'right' },
  colAmount: { width: '18%', textAlign: 'right' },
  cellText: {
    fontSize: 9,
  },
  // Totals
  totalsDivider: {
    borderTopWidth: 1.5,
    borderTopColor: TEAL,
    marginTop: 4,
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  totalsBox: {
    width: 250,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 10,
    color: '#555555',
  },
  totalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: TEAL,
  },
  grandTotalValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: TEAL,
  },
  // Notes/Terms
  notesLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: TEAL,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
});

function fmt(value: number, currency: string): string {
  return `${formatMoney(value)} ${currency}`;
}

export default function InvoicePdf({ state, calculations, logoSrc }: InvoicePdfProps) {
  const companyName = (state.companyInfo ?? '').split('\n')[0] || 'Company';
  const companyAddress = (state.companyInfo ?? '').split('\n').slice(1).join('\n').trim();
  const billToName = (state.billTo ?? '').split('\n')[0] || '';
  const billToAddress = (state.billTo ?? '').split('\n').slice(1).join('\n').trim();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Full-width teal header bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Image src={logoSrc} style={styles.headerIcon} />
            <Text style={styles.headerCompanyName}>{companyName}</Text>
          </View>
          <Text style={styles.headerInvoice}>INVOICE</Text>
        </View>

        {/* Padded content area */}
        <View style={styles.content}>
          {/* Company info (left) + Metadata box (right) */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              {companyAddress ? (
                <Text style={styles.companyAddress}>{companyAddress}</Text>
              ) : null}
              {state.bankInfo ? (
                <>
                  <View style={styles.separator} />
                  <Text style={styles.bankLabel}>Bank Details</Text>
                  <Text style={styles.bankText}>{state.bankInfo}</Text>
                </>
              ) : null}
            </View>
            <View style={styles.infoRight}>
              <View style={styles.metadataBox}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Invoice No.:</Text>
                  <Text style={styles.metaValue}>{state.invoiceNumber || '—'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Invoice Date:</Text>
                  <Text style={styles.metaValue}>{state.invoiceDate || '—'}</Text>
                </View>
                <View style={[styles.metaRow, { marginBottom: 0 }]}>
                  <Text style={styles.metaLabel}>Due Date:</Text>
                  <Text style={styles.metaValue}>{state.dueDate || '—'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bill To */}
          <Text style={styles.billToLabel}>BILL TO:</Text>
          {billToName ? <Text style={styles.billToName}>{billToName}</Text> : null}
          {billToAddress ? <Text style={styles.billToAddress}>{billToAddress}</Text> : (
            <View style={{ marginBottom: 20 }} />
          )}

          {/* Item Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader} fixed>
              <Text style={[styles.tableHeaderText, styles.colNum]}>#</Text>
              <Text style={[styles.tableHeaderText, styles.colDesc]}>DESCRIPTION</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>QTY</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>UNIT PRICE</Text>
              <Text style={[styles.tableHeaderText, styles.colAmount]}>
                AMOUNT ({state.currency})
              </Text>
            </View>

            {state.lineItems.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? ROW_EVEN : ROW_ODD },
                ]}
                wrap={false}
              >
                <Text style={[styles.cellText, styles.colNum]}>{index + 1}</Text>
                <Text style={[styles.cellText, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.cellText, styles.colPrice]}>
                  {formatMoney(item.unitPrice)}
                </Text>
                <Text style={[styles.cellText, styles.colAmount]}>
                  {formatMoney(calculations.lineAmounts[index] ?? 0)}
                </Text>
              </View>
            ))}
          </View>

          {/* Teal divider */}
          <View style={styles.totalsDivider} />

          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  {fmt(calculations.subtotal, state.currency)}
                </Text>
              </View>
              {state.discountPercent > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    Discount ({state.discountPercent}%)
                  </Text>
                  <Text style={styles.totalValue}>
                    -{fmt(calculations.discountAmount, state.currency)}
                  </Text>
                </View>
              )}
              {state.taxPercent > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({state.taxPercent}%)</Text>
                  <Text style={styles.totalValue}>
                    {fmt(calculations.taxAmount, state.currency)}
                  </Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>TOTAL</Text>
                <Text style={styles.grandTotalValue}>
                  {fmt(calculations.total, state.currency)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notes/Terms */}
          {state.notesTerms ? (
            <View>
              <Text style={styles.notesLabel}>NOTES / TERMS</Text>
              <Text style={styles.notesText}>{state.notesTerms}</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
