'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInvoice } from '@/hooks/useInvoice';
import { useTemplates } from '@/hooks/useTemplates';
import { loadLogoBase64 } from '@/lib/logo';
import { buildPdfFilename } from '@/lib/formatting';
import InvoiceHeader from './InvoiceHeader';
import CompanyInfo from './CompanyInfo';
import BillTo from './BillTo';
import LineItemTable from './LineItemTable';
import TotalsSection from './TotalsSection';
import BankInfo from './BankInfo';
import NotesTerms from './NotesTerms';
import Toolbar from './Toolbar';
import TemplateSaveDialog from './TemplateSaveDialog';
import TemplateListDialog from './TemplateListDialog';

export default function InvoiceEditor() {
  const { state, calculations, dispatch } = useInvoice();
  const {
    templates,
    saveTemplate,
    overwriteTemplate,
    deleteTemplate,
    getTemplate,
  } = useTemplates();

  const [dirty, setDirty] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const logoBase64Ref = useRef<string>('');

  useEffect(() => {
    loadLogoBase64().then((data) => {
      logoBase64Ref.current = data;
      setPdfReady(true);
    });
  }, []);

  const markDirty = useCallback(() => setDirty(true), []);

  function dispatchAndMark(action: Parameters<typeof dispatch>[0]) {
    dispatch(action);
    markDirty();
  }

  // --- Field handlers ---
  function handleFieldChange(field: 'invoiceNumber' | 'invoiceDate' | 'dueDate' | 'currency' | 'companyInfo' | 'billTo' | 'bankInfo' | 'notesTerms', value: string) {
    dispatchAndMark({ type: 'SET_FIELD', field, value });
  }

  function handleDiscountChange(value: number) {
    dispatchAndMark({ type: 'SET_FIELD', field: 'discountPercent', value });
  }

  function handleTaxChange(value: number) {
    dispatchAndMark({ type: 'SET_FIELD', field: 'taxPercent', value });
  }

  function handleUpdateItem(id: string, field: keyof import('@/lib/types').LineItem, value: string | number) {
    dispatchAndMark({ type: 'SET_LINE_ITEM', id, field, value });
  }

  function handleRemoveItem(id: string) {
    dispatchAndMark({ type: 'REMOVE_LINE_ITEM', id });
  }

  function handleAddItem() {
    dispatchAndMark({ type: 'ADD_LINE_ITEM' });
  }

  // --- New Invoice ---
  function handleNewInvoice() {
    if (dirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to start a new invoice?'
      );
      if (!confirmed) return;
    }
    dispatch({ type: 'RESET', companyInfo: state.companyInfo });
    setDirty(false);
  }

  // --- Template Save ---
  function handleSaveTemplateClick() {
    setSaveDialogOpen(true);
  }

  function handleSaveTemplate(name: string) {
    const result = saveTemplate(name, state);
    if (result.needsConfirm) {
      // TemplateSaveDialog already shows the overwrite warning and user clicked Save,
      // so we can safely overwrite here
      overwriteTemplate(name, state);
    }
    setSaveDialogOpen(false);
    setDirty(false);
  }

  // --- Template Load ---
  function handleLoadTemplateClick() {
    setLoadDialogOpen(true);
  }

  function handleLoadTemplate(name: string) {
    const template = getTemplate(name);
    if (template) {
      dispatch({ type: 'LOAD_STATE', state: template.state });
      setDirty(false);
    }
    setLoadDialogOpen(false);
  }

  function handleDeleteTemplate(name: string) {
    deleteTemplate(name);
  }

  // --- Export PDF ---
  async function handleExportPdf() {
    if (!pdfReady) return;

    const [{ pdf }, { default: InvoicePdf }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('@/pdf/InvoicePdf'),
    ]);

    const blob = await pdf(
      InvoicePdf({ state, calculations, logoSrc: logoBase64Ref.current })
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = buildPdfFilename(state.invoiceDate, state.invoiceNumber);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Teal header bar */}
      <header className="bg-[var(--color-navy)] text-white py-3 px-6 no-print">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Pike.Silicon.Icon.png" alt="Pike Silicon" className="h-6 w-auto" />
            <h1 className="text-lg font-bold tracking-wide">Pike Silicon</h1>
          </div>
          <span className="text-xl font-semibold tracking-wider">INVOICE</span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-[900px] mx-auto px-6 py-3 no-print">
        <Toolbar
          onExportPdf={handleExportPdf}
          onNewInvoice={handleNewInvoice}
          onSaveTemplate={handleSaveTemplateClick}
          onLoadTemplate={handleLoadTemplateClick}
          pdfReady={pdfReady}
        />
      </div>

      {/* Invoice paper */}
      <div className="max-w-[900px] mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-lg px-4 md:px-10 py-8">
          {/* Header: Logo + metadata */}
          <InvoiceHeader
            invoiceNumber={state.invoiceNumber}
            invoiceDate={state.invoiceDate}
            dueDate={state.dueDate}
            currency={state.currency}
            companyInfo={state.companyInfo}
            onInvoiceNumberChange={(v) => handleFieldChange('invoiceNumber', v)}
            onInvoiceDateChange={(v) => handleFieldChange('invoiceDate', v)}
            onDueDateChange={(v) => handleFieldChange('dueDate', v)}
            onCurrencyChange={(v) => handleFieldChange('currency', v)}
          />

          {/* Company Info + Bill To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <CompanyInfo
              value={state.companyInfo}
              onChange={(v) => handleFieldChange('companyInfo', v)}
            />
            <BillTo
              value={state.billTo}
              onChange={(v) => handleFieldChange('billTo', v)}
            />
          </div>

          {/* Line Items */}
          <div className="mt-8">
            <LineItemTable
              lineItems={state.lineItems}
              lineAmounts={calculations.lineAmounts}
              currency={state.currency}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
            />
          </div>

          {/* Totals */}
          <div className="mt-6">
            <TotalsSection
              calculations={calculations}
              discountPercent={state.discountPercent}
              taxPercent={state.taxPercent}
              currency={state.currency}
              onDiscountChange={handleDiscountChange}
              onTaxChange={handleTaxChange}
            />
          </div>

          {/* Bank Info + Notes/Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-200">
            <BankInfo
              value={state.bankInfo}
              onChange={(v) => handleFieldChange('bankInfo', v)}
            />
            <NotesTerms
              value={state.notesTerms}
              onChange={(v) => handleFieldChange('notesTerms', v)}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <TemplateSaveDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveTemplate}
        existingNames={templates.map((t) => t.name)}
      />
      <TemplateListDialog
        isOpen={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        templates={templates}
        onLoad={handleLoadTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
}
