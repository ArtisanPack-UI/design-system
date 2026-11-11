/**
 * The form editors' shared pieces (#53): the Signature pad, the
 * RichTextEditor's engine and formats, the CodeEditor's keys, and roving
 * focus for their toolbars and tabs. Not Zag machines: plain helpers every
 * stack drives the same way.
 */
export {
  CODE_EDITOR_TRANSLATIONS,
  caretPosition,
  codeEditorKeydown,
  codeEditorTranslations,
  gutterLines,
  lineCount,
  normalizeOptions,
  positionLabel,
  problemsLabel,
  severityByLine,
  type CodeDiagnostic,
  type CodeEditorLanguage,
  type CodeEditorTab,
  type CodeEditorTranslations,
} from './code-editor';
export {
  countLabel,
  fillPlaceholders,
  htmlToMarkdown,
  MARKDOWN_SHORTCUTS,
  markdownToHtml,
  RICH_TEXT_COMMANDS,
  RICH_TEXT_TOOLBARS,
  RICH_TEXT_TRANSLATIONS,
  resolveToolbar,
  richTextFromHtml,
  richTextToHtml,
  richTextTranslations,
  RichTextSurface,
  safeImageUrl,
  safeLinkUrl,
  sanitizeRichText,
  shortcutCommand,
  textStats,
  type RichTextCommand,
  type RichTextCommandValue,
  type RichTextOutput,
  type RichTextSurfaceOptions,
  type RichTextToolbarItem,
  type RichTextTranslations,
} from './rich-text';
export { definedLabels } from './labels';
export { rovingItems, rovingKeydown, syncRovingTabIndex } from './roving';
export {
  initialSignatureMode,
  isSignatureValue,
  readSignatureImage,
  renderTypedSignature,
  SIGNATURE_DATA_URL_PREFIX,
  SIGNATURE_MODES,
  SIGNATURE_TRANSLATIONS,
  signatureModes,
  SignaturePad,
  signatureTranslations,
  type SignatureMode,
  type SignaturePadOptions,
  type SignatureTranslations,
  type TypedSignatureOptions,
} from './signature-pad';
